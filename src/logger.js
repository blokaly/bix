import colors from 'colors'
import logger from 'tracer';

export const console = logger.console(
   {
      format : "  {{message}}"
   });

export const colorConsole = logger.colorConsole(
   {
      format : "  [BIX {{timestamp}}] - {{message}}",
      dateformat : "HH:MM:ss.L",
      filters : [colors.bold]
   }
);

export const jsonConsole = logger.colorConsole({
   format : "{{message}}",
   filters : [colors.inverse, colors.italic]
});