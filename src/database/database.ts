import mongoose from 'mongoose';

import  { mongodb } from './keys';

mongoose.connect(mongodb.URI , {
    useNewUrlParser : true,
})
  .then(db => console.log('DB IS CONECTED'))
  .catch(err => console.error(err));

export default mongodb;