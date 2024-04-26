import axios from 'axios';
import { config } from '../config';
import { ILabelQuery } from '../types/cryptio';
import { ILabelBody } from '../types/cryptio';

export async function postLabel(queryparams: ILabelQuery, body: ILabelBody) {
  try {
    const { data } = await axios.post(
      `${config.CRYPTIO_API_BASE_URL}/label/${queryparams.id}/apply`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'cryptio-api-key': config.CRYPTIO_API_KEY,
        },
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
