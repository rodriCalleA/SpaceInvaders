export class Record {
  username: string = '';
  punctuation: number = 0;
  ufos: number = 0;
  disposedTime: number = 0;
  recordDate: Date = new Date();

  constructor(data: any) {
    this.username = data.username;
    this.punctuation = data.punctuation;
    this.ufos = data.ufos;
    this.disposedTime = data.disposedTime;
    this.recordDate = new Date(data.recordDate);
  }

  getRecordToPost() {
    return {
      punctuation: this.punctuation,
      ufos: this.ufos,
      disposedTime: this.disposedTime,
    };
  }
}
