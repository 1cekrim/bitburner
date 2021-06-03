import numeral from 'numeral';
import 'numeral/locales/bg';
import 'numeral/locales/cs';
import 'numeral/locales/da-dk';
import 'numeral/locales/de';
import 'numeral/locales/en-au';
import 'numeral/locales/en-gb';
import 'numeral/locales/es';
import 'numeral/locales/fr';
import 'numeral/locales/hu';
import 'numeral/locales/it';
import 'numeral/locales/lv';
import 'numeral/locales/no';
import 'numeral/locales/pl';
import 'numeral/locales/ru';

/* eslint-disable class-methods-use-this */

const extraFormats = [1e15, 1e18, 1e21, 1e24, 1e27, 1e30];
const extraNotations = ['q', 'Q', 's', 'S', 'o', 'n'];


class NumeralFormatter {
    // Default Locale
    defaultLocale = "en";

    constructor() {
        this.defaultLocale = 'en';
    }

    updateLocale(l: string): boolean {
        if (numeral.locale(l) == null) {
            console.warn(`Invalid locale for numeral: ${l}`);

            numeral.locale(this.defaultLocale);
            return false;
        }
        return true;
    }

    format(n: number, format: string): string {
        // numeraljs doesnt properly format numbers that are too big or too small
        if (Math.abs(n) < 1e-6) { n = 0; }
        const answer = numeral(n).format(format);
        if (answer === 'NaN') {
            return `${n}`;
        }
        return answer;
    }

    formatBigNumber(n: number): string {
        return this.format(n, "0.000a");
    }

    formatAbsurdNumber(n: number, decimalPlaces: number): string {
        for(let i = 0; i < extraFormats.length; i++) {
            if(extraFormats[i] < n && n <= extraFormats[i]*1000) {
                return this.format(n/extraFormats[i], '0.'+'0'.repeat(decimalPlaces))+extraNotations[i];
            }
        }
        if(Math.abs(n) < 1000) {
            return this.format(n, '0.'+'0'.repeat(decimalPlaces));
        }
        const str = this.format(n, '0.'+'0'.repeat(decimalPlaces) + 'a');
        if(str === "NaNt") return this.format(n, '0.' + ' '.repeat(decimalPlaces) + 'e+0');
        return str;
    }

    formatHp(n: number): string {
        return this.format(n, "0");
    }

    formatMoney(n: number): string {
        return "$" + this.formatAbsurdNumber
    }

    formatSkill(n: number): string {
        return this.format(n, "0,0");
    }

    formatExp(n: number): string {
        return this.formatAbsurdNumber(n, 3);
    }

    formatHashes(n: number): string {
        return this.formatAbsurdNumber(n, 3);
    }

    formatReputation(n: number): string {
        return this.formatAbsurdNumber(n, 3);
    }

    formatFavor(n: number): string {
        return this.format(n, "0,0");
    }

    formatRAM(n: number): string {
        return this.format(n, "0.00")+"GB";
    }

    formatPercentage(n: number, decimalPlaces = 2): string {
        const formatter: string = "0." + "0".repeat(decimalPlaces) + "%";
        return this.format(n, formatter);
    }

    formatServerSecurity(n: number): string {
        return this.format(n, "0,0.000");
    }

    formatRespect(n: number): string {
        return this.formatAbsurdNumber(n, 5);
    }

    formatWanted(n: number): string {
        return this.formatAbsurdNumber(n, 5);
    }

    formatMultiplier(n: number): string {
        return this.format(n, "0,0.00");
    }

    formatSleeveShock(n: number): string {
        return this.format(n, "0,0.000");
    }

    formatSleeveSynchro(n: number): string {
        return this.format(n, "0,0.000");
    }

    formatSleeveMemory(n: number): string {
        return this.format(n, "0");
    }

    formatPopulation(n: number): string {
        return this.format(n, "0.000a");
    }

    formatStamina(n: number): string {
        return this.format(n, "0.0");
    }

    formatShares(n: number): string {
        return this.formatAbsurdNumber(n, 3);
    }

    formatInfiltrationSecurity(n: number): string {
        return this.formatAbsurdNumber(n, 3);
    }

    formatThreads(n: number): string {
        return this.format(n, "0,0");
    }

    parseMoney(s: string): number {
        // numeral library does not handle formats like 1e10 well (returns 110),
        // so if both return a valid number, return the biggest one
        const numeralValue = numeral(s).value();
        const parsed = parseFloat(s);
        if (isNaN(parsed) && numeralValue === null) {
            return NaN;
        } else if (isNaN(parsed)) {
            return numeralValue;
        } else if (numeralValue === null) {
            return parsed;
        } else {
            return Math.max(numeralValue, parsed);
        }
    }
}

export const numeralWrapper = new NumeralFormatter();
