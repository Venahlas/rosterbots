const constants = {
  ROSTER_POINT_CAP : 175,
  ROSTER_STARTERS_CAP : 10,
  ROSTER_SUBSTITUTES_CAP : 5,
  PLAYER_POINT_CAP : 100,
}

constants.ROSTER_PLAYER_CAP = constants.ROSTER_STARTERS_CAP + constants.ROSTER_SUBSTITUTES_CAP;

export default constants;
