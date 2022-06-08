/* !
 * whitespace-regex <https://github.com/jonschlinkert/whitespace-regex>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 *
 * Modified to suit our purposes.
 */

// noinspection RegExpDuplicateCharacterInClass
export const whitespaceRegex = /^[\s\f\n\r\t\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF\u0009\u000A\u000B\u000C\u000D\u0020\u00A0]*$/u // eslint-disable-line no-control-regex, max-len, vue/max-len
