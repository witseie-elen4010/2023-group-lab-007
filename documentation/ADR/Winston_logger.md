# *Winston logger* 

## Description
Winston logger is a widely used third-party logging library that offers significant advantages over the traditional console.log approach. Specifically designed for Node.js, Winston has become the most popular logging library due to its flexibility and extensibility.One of the core features of Winston is its ability to decouple various aspects of logging, such as log levels, formatting, and storage, making each API independent and highly customizable. As a result, it can support numerous combinations to suit various use cases.
Winston supports six log levels by default. 
```{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
```
And utilizes the following commands
```logger.error('error');
logger.warn('warn');
logger.info('info');
logger.verbose('verbose');
logger.debug('debug');
logger.silly('silly');
```

## Why it was implimented
- Improves on the default console.log
- Removes bottle necks from over logging
- Better workflow integration
- Allows developers to define custom log levels, making it easy to categorize and prioritize log messages.
- Winston provides great flexibility in choosing where you want your log entries to be outputted to.
- The ability to customize the output format
- well-documented and has a large community of users, making it easy to find solutions to common problems or get help when needed.