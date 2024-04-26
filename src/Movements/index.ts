import {
  GetMovementsResponse,
  IMovementQuery,
  IMovementResponseData,
} from '../types/cryptio';
import { config } from '../config';
import axios from 'axios';

export async function getMovements(
  queryParams?: IMovementQuery,
): Promise<IMovementResponseData[] | string> {
  try {
    const { data, status } = await axios.get<GetMovementsResponse>(
      `${config.CRYPTIO_API_BASE_URL}/movement`,
      {
        headers: {
          Accept: 'application/json',
          'cryptio-api-key': config.CRYPTIO_API_KEY,
        },
        params: queryParams,
      },
    );

    return data.data;
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
