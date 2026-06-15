import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate.js';
import { RecordsController } from './records.controller.js';

const recordsRoutes = Router();
const recordsController = new RecordsController();

recordsRoutes.use(authenticate);

recordsRoutes.post('/', recordsController.createRecord);
recordsRoutes.get('/', recordsController.getRecords);
recordsRoutes.get('/:recordId', recordsController.getRecordById);
recordsRoutes.put('/:recordId', recordsController.updateRecord);
recordsRoutes.delete('/:recordId', recordsController.deleteRecord);
export default recordsRoutes;
