/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {  ConfigOptions, v2 as cloudinary } from 'cloudinary';

// export const CloudinaryProvider = {
//   provide: 'CLOUDINARY',
// useFactory: (): ConfigOptions => {
//     return cloudinary.config({
//       cloud_name: 'dny5fv00z',
//       api_key: '542829813247915',
//       api_secret: '_x3fbUIgvF3Gg4AC6JFa5o-q6xw',
//     });
// },
// };
cloudinary.config({
    cloud_name: 'dny5fv00z',
    api_key: '542829813247915',
    api_secret: '_x3fbUIgvF3Gg4AC6JFa5o-q6xw',
});
export {cloudinary};


