import _ from 'lodash';
import constants from '../config/constants.js'
function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

function getRandomRange(bottom, top) {
  return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function generateRandomName(){
  return "GenericPlayer" + randomString(3, 'A') + randomString(4, '#');
}

class Bot {
  constructor(name, prospect) {
    this._name = name;
    this.generateAlphaNumber();
    this._speed = prospect.speed;
    this._strength = prospect.strength;
    this._agility = prospect.agility;
    this._starter = false;
  }

  get name() {
    return this._name;
  }

  generateAlphaNumber(){
    this._alphanumber = randomString(3, 'A') + randomString(4, '#');
  }

  get alphanumber() {
    return this._alphanumber;
  }

  get speed() {
    return this._speed;
  }

  get strength() {
    return this._strength;
  }

  get agility() {
    return this._agility;
  }

  get total() {
    return this._speed + this._strength + this._agility
  }

  set starter(isStarting) {
    this._starter = isStarting;
  }

  isStarting() {
    return this._starter;
  }

  toObject() {
    return {
      name : this._name,
      alphanumber: this._alphanumber,
      speed : this._speed,
      strength : this._strength,
      agility : this._agility,
      total : this.total
    }
  }
}

class Roster {
  constructor(teamName, starterSelector) {
    this._players = [];
    this._teamName = teamName;
    this._starterSelector = starterSelector;
  }

  get teamName() {
    return this._teamName;
  }

  get starters() {
    return _.filter(this._players, function(o){ return o.isStarting() })
  }

  get substitutes() {
    return _.filter(this._players, function(o){ return !o.isStarting() })
  }

  isNameOnRoster(name) {
    var hasName = _.find(this._players, function(o) { return o.name == name });
    return !_.isUndefined(hasName)
  }

  isAlphaOnRoster(alpha) {
    var hasAlpha = _.find(this._players, function(o) { return o.alphanumber == alpha });
    return !_.isUndefined(hasAlpha)
  }

  isScoreOnRoster(score) {
    var hasTotal =  _.find(this._players, function(o) { return o.total == score });
    return !_.isUndefined(hasTotal)
  }

  pickStarters(){
    if(this._players.length <= constants.ROSTER_STARTERS_CAP){
      _.each(this._players, function(player){
        player.starter = true
      })
    } else {
      _.each(this._players, function(player){
        player.starter = false
      });
      var that = this;
      this._players.sort(function(a, b) {
        return b[that._starterSelector.toLowerCase()] - a[that._starterSelector.toLowerCase()];
      })
      for(var i=0; i<constants.ROSTER_STARTERS_CAP;i++){
        this._players[i].starter = true;
      }
    }
  }

  addPlayer(newBot) {
    if(!this.isNameOnRoster(newBot.name) &&
         !this.isAlphaOnRoster(newBot.alphanumber) &&
         !this.isScoreOnRoster(newBot.total) &&
         this._players.length < constants.ROSTER_PLAYER_CAP
       ){
        this._players.push(newBot);
        this.pickStarters();
        return true
      } else {
        return false;
      }
  }

  toObject() {
    return {
      teamName : this._teamName,
      starters : _.map(this.starters, function(s){ return s.toObject() }),
      substitutes : _.map(this.substitutes, function(s){ return s.toObject() })
    }
  }
}

export { Roster as Roster }

class Prospect {
  constructor(targetScore, valuedAttribute) {
    this._targetScore = targetScore;
    this._valuedAttribute = valuedAttribute;
  }

  get valuedAttribute() {
    return this._valuedAttribute;
  }
  set targetScore(targetScore) {
    this._targetScore = targetScore;
  }
  get targetScore() {
    return this._targetScore;
  }

  get speed() {
    return this._speed;
  }
  set speed(speed) {
    this._speed = speed;
  }

  get strength() {
    return this._strength;
  }
  set strength(strength) {
    this._strength = strength;
  }

  get agility() {
    return this._agility;
  }
  set agility(agility) {
    this._agility = agility;
  }

  get total() {
    return this._speed + this._strength + this._agility
  }
}


class Drafter {
  constructor(minRating, extraPointsDistribution, prospectAttributePreference) {
    this._prospectsToDraft = [];
    this._minRating = minRating
    this._extraPointsDistribution = extraPointsDistribution;
    if(prospectAttributePreference == '' ||
       _.isUndefined(prospectAttributePreference) ||
       _.isNull(prospectAttributePreference)){
         prospectAttributePreference = "EVEN,SPEED,STRENGTH,AGILITY"
       }
    this._prospectAttributePreference = prospectAttributePreference.split(",");
    this._generateDraftPlan();

  }
  addProspectsToRoster(roster) {
    _.each(this._prospectsToDraft, function(prospect){
      var name = generateRandomName()
      if(roster.teamName == "New England Patriots" || roster.teamName == "NewEnglandPatriots"){
        if(prospect.targetScore >= 32){
          name = "Tom Brady";
        }
      }
      if(roster.teamName == "Boston Celtics" || roster.teamName == "BostonCeltics"){
        if(prospect.targetScore >= 32){
          name = "Paul Pierce";
        }
      }
      while(roster.isNameOnRoster(name)){
        console.log("duplicate name");
        name = generateRandomName();
      }
      var bot = new Bot(name, prospect);
      while(roster.isAlphaOnRoster(bot.alphanumber)){
        console.log("duplicate alpha number");
        bot.generateAlphaNumber();
      }
      if(!roster.addPlayer(bot)) {
        throw new Error("Error Adding Player To Roster, Aborting!")
      }
    })
  }
  draftBots() {
    _.each(this._prospectsToDraft, function(prospect){
      var workingScore = prospect.targetScore;
      if(prospect.valuedAttribute == "EVEN") {
        var individualAttributeScore = Math.floor(prospect.targetScore/3)
        prospect.speed = individualAttributeScore;
        prospect.strength = individualAttributeScore;
        prospect.agility = individualAttributeScore;
        distributeExtraPoints(prospect, ['speed', 'strength', 'agility']);
      } else if(prospect.valuedAttribute == "SPEED") {
        calculateValuedScore(prospect, ...['speed', 'strength', 'agility']);
        distributeExtraPoints(prospect, ['strength', 'agility']);
      } else if (prospect.valuedAttribute == "STRENGTH") {
        calculateValuedScore(prospect, ...['strength', 'agility', 'speed']);
        distributeExtraPoints(prospect, ['speed', 'agility']);
      } else if (prospect.valuedAttribute == "AGILITY") {
        calculateValuedScore(prospect, ...['agility', 'speed', 'strength']);
        distributeExtraPoints(prospect, ['speed', 'strength']);
      }
    });

    function calculateValuedScore(prospect, ...args){
      var subtract = prospect.targetScore < 2 ? prospect.targetScore : 2
      var bottomScore = findBottomScore(prospect.targetScore, 0.4);
      prospect[args[0]]=getRandomRange(bottomScore, prospect.targetScore-subtract);
      var scoreLeft = prospect.targetScore - prospect[args[0]];
      var scoreLeftSplit = 0
      if(subtract == 0 || subtract == 1){
        scoreLeftSplit = 0;
      } else {
        scoreLeftSplit = Math.floor(scoreLeft/subtract)
      }
      prospect[args[1]] = scoreLeftSplit
      prospect[args[2]] = scoreLeftSplit;
    }

    function distributeExtraPoints(prospect, attributeToAddArray) {
      //var attributeToAddArray = ['speed', 'strength']
      var attributeToAdd = 0
      while(prospect.total < prospect.targetScore) {
        prospect[attributeToAddArray[attributeToAdd % attributeToAddArray.length]]++;
        attributeToAdd++;
      }
    }

    function findBottomScore(workingScore, percentage){
      var subtract = workingScore < 2 ? workingScore : 2
      var bottomScore = workingScore - subtract;
      if(Math.round(workingScore*percentage) <= workingScore-subtract &&
                   (workingScore-subtract) !=1 && (workingScore-subtract) != 0){
        bottomScore = Math.round(workingScore*percentage)
      }
      if(bottomScore == 0 && workingScore >=1 &&workingScore <= 2) return 1;
      return bottomScore;
    }
  }

  isValidDraft(){
    return (_.sumBy(this._prospectsToDraft, 'targetScore') <= constants.ROSTER_POINT_CAP)
  }

  _generateDraftPlan() {
    for (var i=0; i<constants.ROSTER_PLAYER_CAP; i++){
      this._prospectsToDraft.push(new Prospect(this._minRating+constants.ROSTER_PLAYER_CAP-i-1,
                                               this._prospectAttributePreference[i % this._prospectAttributePreference.length] ));
    }

    var statAdd;
    if(this._extraPointsDistribution == 'EVEN') {
      statAdd = 1;
    } else if(this._extraPointsDistribution == 'MAX') {
      statAdd = constants.ROSTER_POINT_CAP - _.sumBy(this._prospectsToDraft, 'targetScore');
    } else if(_.isNumber(this._extraPointsDistribution)) {
      statAdd = parseInt(this._extraPointsDistribution);
    } else {
      statAdd = 1;
    }
    var prospectIndex = 0;
    while(_.sumBy(this._prospectsToDraft, 'targetScore') < constants.ROSTER_POINT_CAP){
      var add = statAdd;
      if(constants.ROSTER_POINT_CAP - _.sumBy(this._prospectsToDraft, 'targetScore') >= statAdd){
        add = statAdd;
      } else {
        add = constants.ROSTER_POINT_CAP - _.sumBy(this._prospectsToDraft, 'targetScore');
      }
      this._prospectsToDraft[prospectIndex].targetScore += add;
      prospectIndex++;
      if(prospectIndex == this._prospectsToDraft.length){
        prospectIndex = 0;
      }
    }
  }
}

export { Drafter as Drafter }
