class ApiResponse {
  statusCode: number;
  message: string;
  data: any;
  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
