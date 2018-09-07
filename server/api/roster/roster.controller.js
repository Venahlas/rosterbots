'use strict';
import _ from 'lodash';
import {Roster,Drafter} from '../../rosterutils/rosterutils.js';

export function generate(req, res) {
  var teamName = "New England Patriots";
  if(req.query.teamName) {
    teamName = req.query.teamName;
  }
  var starterSelector = "TOTAL"
  if(req.query.starterSelector){
    if(_.includes(['TOTAL','SPEED','STRENGTH','AGILITY'], req.query.starterSelector))
    {
      starterSelector = req.query.starterSelector;
    }
  }
  var minRating = 3;
  if(req.query.minRating) {
    minRating = parseInt(req.query.minRating);
  }
  var extraPoints = 1;
  if(req.query.extraPoints){
    if(req.query.extraPoints == "EVEN" ||
       req.query.extraPoints == "MAX" ||
       _.isNumber(parseInt(req.query.extraPoints))){
         extraPoints = parseInt(req.query.extraPoints);
       }
  }
  var attributePreference = "EVEN,SPEED,STRENGTH,AGILITY"
  if(req.query.attributePreference) {
    if(_.isString(req.query.attributePreference)){
      var checkPreference = req.query.attributePreference.split(',');
      var valid = false;
      for(var i = 0; i<checkPreference.length; i++){
        if(!_.includes(['EVEN','SPEED','STRENGTH','AGILITY'], checkPreference[i])){
          valid = false;
          break;
        } else {
          valid = true;
        }
      }
      if(valid){
        attributePreference = req.query.attributePreference;
      }
    }
  }
  var roster = new Roster(teamName, starterSelector);
  var drafter = new Drafter(minRating, extraPoints, attributePreference);
  if(!drafter.isValidDraft()) {
    return res.json({ error : "Invalid Draft Configuration"})
  }
  drafter.draftBots();
  drafter.addProspectsToRoster(roster);
  res.json(roster.toObject());
}
