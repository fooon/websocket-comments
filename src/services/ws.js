import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import EventEmitter from 'events';

class CommentsClient extends EventEmitter {
  constructor() {
    super();
    const connection = new HubConnectionBuilder()
      .withUrl("/api/hubs/comments")
      .configureLogging(LogLevel.None)
      .build();

    connection.on("SendComment", (message) => {
      this.emit('message', message);
    });
    connection.on("UpdateComment", (message) => {
      this.emit('update', message);
    });
    connection.on("DeleteComment", (message) => {
      this.emit('delete', message);
    });
    connection.on("Writing", (status) => {
      this.emit('writing', status);
    });

    connection.start()
  }
}

export default CommentsClient;