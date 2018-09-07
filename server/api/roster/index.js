'use strict';

import {Router} from 'express';
import * as controller from './roster.controller';

var router = new Router();

router.get('/generate', controller.generate);

module.exports = router;
