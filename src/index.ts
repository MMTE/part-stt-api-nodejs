import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';

interface BaseResponse {
  data: Record<string, any>;
  meta: {
    requestId: string;
    shamsiDate: string;
  };
}

interface SendFileAsBase64Request {
  language: string;
  data: string;
}

interface SendFileRequest {
  language: string;
  file: fs.ReadStream;
}

interface SendLargeFileRequest {
  language: string;
  file: fs.ReadStream;
}

interface ProcessLinkRequest {
  language: string;
  link: string;
}

export default class SpeechToTextAPI {
  private endpointURL: string;
  private gatewayToken: string;

  constructor(endpointURL: string, gatewayToken: string) {
    this.endpointURL = endpointURL;
    this.gatewayToken = gatewayToken;
  }

  async sendFileAsBase64(language: string, base64Data: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await axios.post(
        `${this.endpointURL}/speechRecognition/v1/base64`,
        { language, data: base64Data } as SendFileAsBase64Request,
        {
          headers: {
            'gateway-token': this.gatewayToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
        throw new Error(`Error sending file as base64: ${error.message}`);
    }
  }

  async sendFile(language: string, filePath: string): Promise<BaseResponse> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const response: AxiosResponse<BaseResponse> = await axios.post(
        `${this.endpointURL}/speechRecognition/v1/file`,
        {
          language: language,
          file: fileStream
        },
        {
          headers: {
            'gateway-token': this.gatewayToken,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error sending file: ${error.message}`);
    }
  }

  async sendLargeFile(language: string, filePath: string): Promise<BaseResponse> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const response: AxiosResponse<BaseResponse> = await axios.post(
        `${this.endpointURL}/speechRecognition/v1/largeFile`,
        {
          language: language,
          file: fileStream
        },
        {
          headers: {
            'gateway-token': this.gatewayToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
        throw new Error(`Error sending large file: ${error.message}`);
    }
  }

  async checkResult(token: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await axios.get(
        `${this.endpointURL}/speechRecognition/v1/trackingText/${token}`,
        {
          headers: {
            'gateway-token': this.gatewayToken,
          },
        }
      );
      return response.data;
    } catch (error: any) {
        throw new Error(`Error checking result: ${error.message}`);
    }
  }

  async processLink(language: string, link: string): Promise<BaseResponse> {
    try {
      const response: AxiosResponse<BaseResponse> = await axios.post(
        `${this.endpointURL}/speechRecognition/v1/link`,
        { language, link } as ProcessLinkRequest,
        {
          headers: {
            'gateway-token': this.gatewayToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
        throw new Error(`Error processing link: ${error.message}`);
    }
  }
}

// module.exports = SpeechToTextAPI;
