import { Injectable } from '@nestjs/common';

export interface RespondeData {
  message: string;
  success: boolean;
  data?: any;
  errors?: any;
}

@Injectable()
export class CommonService {
  static responseFormate(
    message: string = '',
    data: any = null,
    errors: any = null,
  ): RespondeData {
    return {
      message,
      data: errors ? undefined : data,
      success: errors ? false : true,
      errors: errors ? errors : undefined,
    };
  }
}
