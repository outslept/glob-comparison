import process from "node:process";
import * as tty from "node:tty";

const is_color_support =
  !("NO_COLOR" in process.env) &&
  !process.argv.includes("--no-color") &&
  ("FORCE_COLOR" in process.env ||
    process.argv.includes("--color") ||
    process.platform === "win32" ||
    (tty.isatty(1) && process.env.TERM !== "dumb") ||
    "CI" in process.env);

function format(start: number, end: number) {
  return (input) => {
    const open = `\u001B[${start}m`;
    const close = `\u001B[${end}m`;
    const string = String(input);
    const regex = new RegExp(`\\x1b\\[${end}m`, "g");

    return is_color_support
      ? open + string.replace(regex, open) + close
      : String(string);
  };
}

export default {
  yellow: format(93, 39),
  green: format(92, 39),
  cyan: format(96, 39),
  bold: format(1, 22),
  red: format(91, 39),
};
