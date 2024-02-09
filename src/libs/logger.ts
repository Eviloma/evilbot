import pino from 'pino';
import pinoToSeq from 'pino-seq';

const stream = pinoToSeq.createStream({
  serverUrl: '',
  apiKey: '',
  onError: (e) => console.log(e),
});
const logger = pino({ name: 'Evilbot' }, stream);

export default logger;
