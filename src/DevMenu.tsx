import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { CodingContractTypes } from "./CodingContracts";
import { generateContract, generateRandomContract, generateRandomContractOnHome } from "./CodingContractGenerator";
import { Companies } from "./Company/Companies";
import { Programs } from "./Programs/Programs";
import { Factions } from "./Faction/Factions";
import { IPlayer } from "./PersonObjects/IPlayer";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { AllServers } from "./Server/AllServers";
import { HacknetServer } from "./Hacknet/HacknetServer";
import { GetServerByHostname } from "./Server/ServerHelpers";
import { hackWorldDaemon } from "./RedPill";
import { StockMarket } from "./StockMarket/StockMarket";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { Stock } from "./StockMarket/Stock";
import { IEngine } from "./IEngine";
import { saveObject } from "./SaveObject";

import { dialogBoxCreate } from "../utils/DialogBox";
import { Money } from "./ui/React/Money";

import React, { useState } from "react";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Some dev menu buttons just add a lot of something for convenience
const tonsPP = 1e27;
const tonsP = 1e12;

interface IValueAdjusterProps {
  title: string;
  add: (x: number) => void;
  subtract: (x: number) => void;
  reset: () => void;
}

function ValueAdjusterComponent(props: IValueAdjusterProps): React.ReactElement {
  const [value, setValue] = useState(0);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(parseFloat(event.target.value));
  }

  const { title, add, subtract, reset } = props;
  return (
    <>
      <button className="std-button add-exp-button" onClick={() => add(value)}>
        +
      </button>
      <input
        className="text-input exp-input"
        type="number"
        placeholder={`+/- ${title}`}
        value={value}
        onChange={onChange}
      ></input>
      <button className="std-button remove-exp-button" onClick={() => subtract(value)}>
        -
      </button>
      <button className="std-button" onClick={reset}>
        Reset
      </button>
    </>
  );
}

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function DevMenuRoot(props: IProps): React.ReactElement {
  const [company, setCompany] = useState("ECorp");
  const [faction, setFaction] = useState("Illuminati");
  const [program, setProgram] = useState("NUKE.exe");
  const [server, setServer] = useState("home");
  const [augmentation, setAugmentation] = useState("Augmented Targeting I");
  const [codingcontract, setCodingcontract] = useState("Find Largest Prime Factor");
  const [stockPrice, setStockPrice] = useState(0);
  const [stockSymbol, setStockSymbol] = useState("");

  function setFactionDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setFaction(event.target.value);
  }

  function setCompanyDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCompany(event.target.value);
  }

  function setProgramDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setProgram(event.target.value);
  }

  function setServerDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setServer(event.target.value);
  }

  function setAugmentationDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setAugmentation(event.target.value);
  }

  function setCodingcontractDropdown(event: React.ChangeEvent<HTMLSelectElement>): void {
    setCodingcontract(event.target.value);
  }

  function setStockPriceField(event: React.ChangeEvent<HTMLInputElement>): void {
    setStockPrice(parseFloat(event.target.value));
  }

  function setStockSymbolField(event: React.ChangeEvent<HTMLInputElement>): void {
    setStockSymbol(event.target.value);
  }

  function addMoney(n: number) {
    return function () {
      props.player.gainMoney(n);
    };
  }

  function upgradeRam(): void {
    props.player.getHomeComputer().maxRam *= 2;
  }

  function quickB1tFlum3(): void {
    hackWorldDaemon(props.player.bitNodeN, true, true);
  }

  function b1tflum3(): void {
    hackWorldDaemon(props.player.bitNodeN, true);
  }

  function quickHackW0r1dD43m0n(): void {
    hackWorldDaemon(props.player.bitNodeN, false, true);
  }

  function hackW0r1dD43m0n(): void {
    hackWorldDaemon(props.player.bitNodeN);
  }

  function modifyExp(stat: string, modifier: number) {
    return function (exp: number) {
      switch (stat) {
        case "hacking":
          if (exp) {
            props.player.gainHackingExp(exp * modifier);
          }
          break;
        case "strength":
          if (exp) {
            props.player.gainStrengthExp(exp * modifier);
          }
          break;
        case "defense":
          if (exp) {
            props.player.gainDefenseExp(exp * modifier);
          }
          break;
        case "dexterity":
          if (exp) {
            props.player.gainDexterityExp(exp * modifier);
          }
          break;
        case "agility":
          if (exp) {
            props.player.gainAgilityExp(exp * modifier);
          }
          break;
        case "charisma":
          if (exp) {
            props.player.gainCharismaExp(exp * modifier);
          }
          break;
        case "intelligence":
          if (exp) {
            props.player.gainIntelligenceExp(exp * modifier);
          }
          break;
      }
      props.player.updateSkillLevels();
    };
  }

  function modifyKarma(modifier: number) {
    return function (amt: number) {
      props.player.karma += amt * modifier;
    };
  }

  function tonsOfExp(): void {
    props.player.gainHackingExp(tonsPP);
    props.player.gainStrengthExp(tonsPP);
    props.player.gainDefenseExp(tonsPP);
    props.player.gainDexterityExp(tonsPP);
    props.player.gainAgilityExp(tonsPP);
    props.player.gainCharismaExp(tonsPP);
    props.player.gainIntelligenceExp(tonsPP);
    props.player.updateSkillLevels();
  }

  function resetAllExp(): void {
    props.player.hacking_exp = 0;
    props.player.strength_exp = 0;
    props.player.defense_exp = 0;
    props.player.dexterity_exp = 0;
    props.player.agility_exp = 0;
    props.player.charisma_exp = 0;
    props.player.intelligence_exp = 0;
    props.player.updateSkillLevels();
  }

  function resetExperience(stat: string): () => void {
    return function () {
      switch (stat) {
        case "hacking":
          props.player.hacking_exp = 0;
          break;
        case "strength":
          props.player.strength_exp = 0;
          break;
        case "defense":
          props.player.defense_exp = 0;
          break;
        case "dexterity":
          props.player.dexterity_exp = 0;
          break;
        case "agility":
          props.player.agility_exp = 0;
          break;
        case "charisma":
          props.player.charisma_exp = 0;
          break;
        case "intelligence":
          props.player.intelligence_exp = 0;
          break;
      }
      props.player.updateSkillLevels();
    };
  }

  function resetKarma(): () => void {
    return function () {
      props.player.karma = 0;
    };
  }

  function enableIntelligence(): void {
    if (props.player.intelligence === 0) {
      props.player.intelligence = 1;
      props.player.updateSkillLevels();
    }
  }

  function disableIntelligence(): void {
    props.player.intelligence_exp = 0;
    props.player.intelligence = 0;
    props.player.updateSkillLevels();
  }

  function receiveInvite(): void {
    props.player.receiveInvite(faction);
  }

  function receiveAllInvites(): void {
    for (const i in Factions) {
      props.player.receiveInvite(Factions[i].name);
    }
  }

  function modifyFactionRep(modifier: number): (x: number) => void {
    return function (reputation: number): void {
      const fac = Factions[faction];
      if (fac != null && !isNaN(reputation)) {
        fac.playerReputation += reputation * modifier;
      }
    };
  }

  function resetFactionRep(): void {
    const fac = Factions[faction];
    if (fac != null) {
      fac.playerReputation = 0;
    }
  }

  function modifyFactionFavor(modifier: number): (x: number) => void {
    return function (favor: number): void {
      const fac = Factions[faction];
      if (fac != null && !isNaN(favor)) {
        fac.favor += favor * modifier;
      }
    };
  }

  function resetFactionFavor(): void {
    const fac = Factions[faction];
    if (fac != null) {
      fac.favor = 0;
    }
  }

  function tonsOfRep(): void {
    for (const i in Factions) {
      Factions[i].playerReputation = tonsPP;
    }
  }

  function resetAllRep(): void {
    for (const i in Factions) {
      Factions[i].playerReputation = 0;
    }
  }

  function tonsOfFactionFavor(): void {
    for (const i in Factions) {
      Factions[i].favor = tonsPP;
    }
  }

  function resetAllFactionFavor(): void {
    for (const i in Factions) {
      Factions[i].favor = 0;
    }
  }

  function queueAug(): void {
    props.player.queueAugmentation(augmentation);
  }

  function queueAllAugs(): void {
    for (const i in AugmentationNames) {
      const augName = AugmentationNames[i];
      props.player.queueAugmentation(augName);
    }
  }

  function setSF(sfN: number, sfLvl: number) {
    return function () {
      if (sfLvl === 0) {
        props.player.sourceFiles = props.player.sourceFiles.filter((sf) => sf.n !== sfN);
        return;
      }

      if (!props.player.sourceFiles.some((sf) => sf.n === sfN)) {
        props.player.sourceFiles.push(new PlayerOwnedSourceFile(sfN, sfLvl));
        return;
      }

      for (let i = 0; i < props.player.sourceFiles.length; i++) {
        if (props.player.sourceFiles[i].n === sfN) {
          props.player.sourceFiles[i].lvl = sfLvl;
        }
      }
    };
  }

  function setAllSF(sfLvl: number) {
    return () => {
      for (let i = 0; i < validSFN.length; i++) {
        setSF(validSFN[i], sfLvl)();
      }
    };
  }

  function clearExploits(): void {
    props.player.exploits = [];
  }

  function addProgram(): void {
    if (!props.player.hasProgram(program)) {
      props.player.getHomeComputer().programs.push(program);
    }
  }

  function addAllPrograms(): void {
    for (const i in Programs) {
      if (!props.player.hasProgram(Programs[i].name)) {
        props.player.getHomeComputer().programs.push(Programs[i].name);
      }
    }
  }

  function rootServer(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.hasAdminRights = true;
    s.sshPortOpen = true;
    s.ftpPortOpen = true;
    s.smtpPortOpen = true;
    s.httpPortOpen = true;
    s.sqlPortOpen = true;
    s.openPortCount = 5;
  }

  function rootAllServers(): void {
    for (const i in AllServers) {
      const s = AllServers[i];
      if (s instanceof HacknetServer) return;
      s.hasAdminRights = true;
      s.sshPortOpen = true;
      s.ftpPortOpen = true;
      s.smtpPortOpen = true;
      s.httpPortOpen = true;
      s.sqlPortOpen = true;
      s.openPortCount = 5;
    }
  }

  function minSecurity(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.hackDifficulty = s.minDifficulty;
  }

  function minAllSecurity(): void {
    for (const i in AllServers) {
      const server = AllServers[i];
      if (server instanceof HacknetServer) continue;
      server.hackDifficulty = server.minDifficulty;
    }
  }

  function maxMoney(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.moneyAvailable = s.moneyMax;
  }

  function maxAllMoney(): void {
    for (const i in AllServers) {
      const server = AllServers[i];
      if (server instanceof HacknetServer) continue;
      server.moneyAvailable = server.moneyMax;
    }
  }

  function modifyCompanyRep(modifier: number): (x: number) => void {
    return function (reputation: number): void {
      const c = Companies[company];
      if (c != null && !isNaN(reputation)) {
        c.playerReputation += reputation * modifier;
      }
    };
  }

  function resetCompanyRep(): void {
    Companies[company].playerReputation = 0;
  }

  function modifyCompanyFavor(modifier: number): (x: number) => void {
    return function (favor: number): void {
      const c = Companies[company];
      if (c != null && !isNaN(favor)) {
        c.favor += favor * modifier;
      }
    };
  }

  function resetCompanyFavor(): void {
    Companies[company].favor = 0;
  }

  function tonsOfRepCompanies(): void {
    for (const c in Companies) {
      Companies[c].playerReputation = tonsP;
    }
  }

  function resetAllRepCompanies(): void {
    for (const c in Companies) {
      Companies[c].playerReputation = 0;
    }
  }

  function tonsOfFavorCompanies(): void {
    for (const c in Companies) {
      Companies[c].favor = tonsP;
    }
  }

  function resetAllFavorCompanies(): void {
    for (const c in Companies) {
      Companies[c].favor = 0;
    }
  }

  function modifyBladeburnerRank(modify: number): (x: number) => void {
    return function (rank: number): void {
      if (props.player.bladeburner) {
        props.player.bladeburner.changeRank(props.player, rank * modify);
      }
    };
  }

  function resetBladeburnerRank(): void {
    props.player.bladeburner.rank = 0;
    props.player.bladeburner.maxRank = 0;
  }

  function addTonsBladeburnerRank(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.changeRank(props.player, tonsP);
    }
  }

  function modifyBladeburnerCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.bladeburner) {
        props.player.bladeburner.storedCycles += cycles * modify;
      }
    };
  }

  function resetBladeburnerCycles(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.storedCycles = 0;
    }
  }

  function addTonsBladeburnerCycles(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.storedCycles += tonsP;
    }
  }

  function addTonsGangCycles(): void {
    if (props.player.gang) {
      props.player.gang.storedCycles = tonsP;
    }
  }

  function modifyGangCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.gang) {
        props.player.gang.storedCycles += cycles * modify;
      }
    };
  }

  function resetGangCycles(): void {
    if (props.player.gang) {
      props.player.gang.storedCycles = 0;
    }
  }

  function addTonsCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds.plus(1e99);
    }
  }

  function resetCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds.minus(props.player.corporation.funds);
    }
  }

  function addTonsCorporationCycles(): void {
    if (props.player.corporation) {
      props.player.corporation.storedCycles = tonsP;
    }
  }

  function modifyCorporationCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.corporation) {
        props.player.corporation.storedCycles += cycles * modify;
      }
    };
  }

  function resetCorporationCycles(): void {
    if (props.player.corporation) {
      props.player.corporation.storedCycles = 0;
    }
  }

  function finishCorporationProducts(): void {
    if (!props.player.corporation) return;
    props.player.corporation.divisions.forEach((div) => {
      Object.keys(div.products).forEach((prod) => {
        const product = div.products[prod];
        if (product === undefined) throw new Error("Impossible product undefined");
        product.prog = 99.9;
      });
    });
  }

  function addCorporationResearch(): void {
    if (!props.player.corporation) return;
    props.player.corporation.divisions.forEach((div) => {
      div.sciResearch.qty += 1e10;
    });
  }

  function specificContract(): void {
    generateContract({
      problemType: codingcontract,
      server: "home",
    });
  }

  function processStocks(sub: (arg0: Stock) => void): void {
    const inputSymbols = stockSymbol.replace(/\s/g, "");

    let match: (symbol: string) => boolean = (): boolean => {
      return true;
    };

    if (inputSymbols !== "" && inputSymbols !== "all") {
      match = function (symbol: string): boolean {
        return inputSymbols.split(",").includes(symbol);
      };
    }

    for (const name in StockMarket) {
      if (StockMarket.hasOwnProperty(name)) {
        const stock = StockMarket[name];
        if (stock instanceof Stock && match(stock.symbol)) {
          sub(stock);
        }
      }
    }
  }

  function doSetStockPrice(): void {
    if (!isNaN(stockPrice)) {
      processStocks((stock: Stock) => {
        stock.price = stockPrice;
      });
    }
  }

  function viewStockCaps(): void {
    const stocks: JSX.Element[] = [];
    processStocks((stock: Stock) => {
      stocks.push(
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td style={{ textAlign: "right" }}>
            <Money money={stock.cap} />
          </td>
        </tr>,
      );
    });
    dialogBoxCreate(
      <table>
        <tbody>
          <tr>
            <th>Stock</th>
            <th>Price cap</th>
          </tr>
          {stocks}
        </tbody>
      </table>,
    );
  }

  function sleeveMaxAllShock(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].shock = 0;
    }
  }

  function sleeveClearAllShock(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].shock = 100;
    }
  }

  function sleeveSyncMaxAll(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].sync = 100;
    }
  }

  function sleeveSyncClearAll(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].sync = 0;
    }
  }

  function timeskip(time: number) {
    return () => {
      props.player.lastUpdate -= time;
      props.engine._lastUpdate -= time;
      saveObject.saveGame(props.engine.indexedDb);
      setTimeout(() => location.reload(), 1000);
    };
  }

  const factions = [];
  for (const i in Factions) {
    factions.push(
      <option key={Factions[i].name} value={Factions[i].name}>
        {Factions[i].name}
      </option>,
    );
  }

  const augs = [];
  for (const i in AugmentationNames) {
    augs.push(
      <option key={AugmentationNames[i]} value={AugmentationNames[i]}>
        {AugmentationNames[i]}
      </option>,
    );
  }

  const programs = [];
  for (const i in Programs) {
    programs.push(
      <option key={Programs[i].name} value={Programs[i].name}>
        {Programs[i].name}
      </option>,
    );
  }

  const servers = [];
  for (const i in AllServers) {
    const hn = AllServers[i].hostname;
    servers.push(
      <option key={hn} value={hn}>
        {hn}
      </option>,
    );
  }

  const companies = [];
  for (const c in Companies) {
    const name = Companies[c].name;
    companies.push(
      <option key={name} value={name}>
        {name}
      </option>,
    );
  }

  const contractTypes = [];
  const contractTypeNames = Object.keys(CodingContractTypes);
  for (let i = 0; i < contractTypeNames.length; i++) {
    const name = contractTypeNames[i];
    contractTypes.push(
      <option key={name} value={name}>
        {name}
      </option>,
    );
  }

  return (
    <div className="col">
      <div className="row">
        <h1>Development Menu - Only meant to be used for testing/debugging</h1>
      </div>
      <div className="row">
        <h2>Generic</h2>
      </div>
      <div className="row">
        <button className="std-button" onClick={addMoney(1e6)}>
          Add <Money money={1e6} />
        </button>
        <button className="std-button" onClick={addMoney(1e9)}>
          Add <Money money={1e9} />
        </button>
        <button className="std-button" onClick={addMoney(1e12)}>
          Add <Money money={1e12} />
        </button>
        <button className="std-button" onClick={addMoney(1e15)}>
          Add <Money money={1000e12} />
        </button>
        <button className="std-button" onClick={addMoney(Infinity)}>
          Add <Money money={Infinity} />
        </button>
        <button className="std-button" onClick={upgradeRam}>
          Upgrade Home Computer's RAM
        </button>
      </div>
      <div className="row">
        <button className="std-button" onClick={quickB1tFlum3}>
          Quick b1t_flum3.exe
        </button>
        <button className="std-button" onClick={b1tflum3}>
          Run b1t_flum3.exe
        </button>
        <button className="std-button" onClick={quickHackW0r1dD43m0n}>
          Quick w0rld_d34m0n
        </button>
        <button className="std-button" onClick={hackW0r1dD43m0n}>
          Hack w0rld_d34m0n
        </button>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Experience / Stats</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text text-center">All:</span>
                </td>
                <td>
                  <button className="std-button tooltip" onClick={tonsOfExp}>
                    Tons of exp
                    <span className="tooltiptext">Sometimes you just need a ton of experience in every stat</span>
                  </button>
                  <button className="std-button tooltip" onClick={resetAllExp}>
                    Reset
                    <span className="tooltiptext">Reset all experience to 0</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Hacking:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="hacking exp"
                    add={modifyExp("hacking", 1)}
                    subtract={modifyExp("hacking", -1)}
                    reset={resetExperience("hacking")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Strength:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="strength exp"
                    add={modifyExp("strength", 1)}
                    subtract={modifyExp("strength", -1)}
                    reset={resetExperience("strength")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Defense:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="defense exp"
                    add={modifyExp("defense", 1)}
                    subtract={modifyExp("defense", -1)}
                    reset={resetExperience("defense")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Dexterity:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="dexterity exp"
                    add={modifyExp("dexterity", 1)}
                    subtract={modifyExp("dexterity", -1)}
                    reset={resetExperience("dexterity")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Agility:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="agility exp"
                    add={modifyExp("agility", 1)}
                    subtract={modifyExp("agility", -1)}
                    reset={resetExperience("agility")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Charisma:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="charisma exp"
                    add={modifyExp("charisma", 1)}
                    subtract={modifyExp("charisma", -1)}
                    reset={resetExperience("charisma")}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Intelligence:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="intelligence exp"
                    add={modifyExp("intelligence", 1)}
                    subtract={modifyExp("intelligence", -1)}
                    reset={resetExperience("intelligence")}
                  />
                </td>
                <td>
                  <button className="std-button" onClick={enableIntelligence}>
                    Enable
                  </button>
                </td>
                <td>
                  <button className="std-button" onClick={disableIntelligence}>
                    Disable
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text text-center">Karma:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="karma"
                    add={modifyKarma(1)}
                    subtract={modifyKarma(-1)}
                    reset={resetKarma()}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Factions</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Faction:</span>
                </td>
                <td>
                  <select
                    id="factions-dropdown"
                    className="dropdown exp-input"
                    onChange={setFactionDropdown}
                    value={faction}
                  >
                    {factions}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Invites:</span>
                </td>
                <td>
                  <button className="std-button" onClick={receiveInvite}>
                    Receive invite from faction
                  </button>
                </td>
                <td>
                  <button className="std-button" onClick={receiveAllInvites}>
                    Receive all Invites
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Reputation:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="reputation"
                    add={modifyFactionRep(1)}
                    subtract={modifyFactionRep(-1)}
                    reset={resetFactionRep}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Favor:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="favor"
                    add={modifyFactionFavor(1)}
                    subtract={modifyFactionFavor(-1)}
                    reset={resetFactionFavor}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">All Reputation:</span>
                </td>
                <td>
                  <button className="std-button" onClick={tonsOfRep}>
                    Tons
                  </button>
                  <button className="std-button" onClick={resetAllRep}>
                    Reset
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">All Favor:</span>
                </td>
                <td>
                  <button className="std-button" onClick={tonsOfFactionFavor}>
                    Tons
                  </button>
                  <button className="std-button" onClick={resetAllFactionFavor}>
                    Reset
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Augmentations</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Aug:</span>
                </td>
                <td>
                  <select
                    id="dev-augs-dropdown"
                    className="dropdown"
                    onChange={setAugmentationDropdown}
                    value={augmentation}
                  >
                    {augs}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Queue:</span>
                </td>
                <td>
                  <button className="std-button" onClick={queueAug}>
                    One
                  </button>
                  <button className="std-button" onClick={queueAllAugs}>
                    All
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Source-Files</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Exploits:</span>
                </td>
                <td>
                  <button className="std-button touch-right" onClick={clearExploits}>
                    Clear
                  </button>
                </td>
              </tr>
              <tr key={"sf-all"}>
                <td>
                  <span className="text">All:</span>
                </td>
                <td>
                  <button className="std-button touch-right" onClick={setAllSF(0)}>
                    0
                  </button>
                  <button className="std-button touch-sides" onClick={setAllSF(1)}>
                    1
                  </button>
                  <button className="std-button touch-sides" onClick={setAllSF(2)}>
                    2
                  </button>
                  <button className="std-button touch-left" onClick={setAllSF(3)}>
                    3
                  </button>
                </td>
              </tr>
              {validSFN.map((i) => (
                <tr key={"sf-" + i}>
                  <td>
                    <span className="text">SF-{i}:</span>
                  </td>
                  <td>
                    <button className="std-button touch-right" onClick={setSF(i, 0)}>
                      0
                    </button>
                    <button className="std-button touch-sides" onClick={setSF(i, 1)}>
                      1
                    </button>
                    <button className="std-button touch-sides" onClick={setSF(i, 2)}>
                      2
                    </button>
                    <button className="std-button touch-left" onClick={setSF(i, 3)}>
                      3
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Programs</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Program:</span>
                </td>
                <td>
                  <select id="dev-programs-dropdown" className="dropdown" onChange={setProgramDropdown} value={program}>
                    {programs}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Add:</span>
                </td>
                <td>
                  <button className="std-button" onClick={addProgram}>
                    One
                  </button>
                  <button className="std-button" onClick={addAllPrograms}>
                    All
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Servers</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Server:</span>
                </td>
                <td colSpan={2}>
                  <select id="dev-servers-dropdown" className="dropdown" onChange={setServerDropdown} value={server}>
                    {servers}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Root:</span>
                </td>
                <td>
                  <button className="std-button" onClick={rootServer}>
                    Root one
                  </button>
                </td>
                <td>
                  <button className="std-button" onClick={rootAllServers}>
                    Root all
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Security:</span>
                </td>
                <td>
                  <button className="std-button" onClick={minSecurity}>
                    Min one
                  </button>
                </td>
                <td>
                  <button className="std-button" onClick={minAllSecurity}>
                    Min all
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Money:</span>
                </td>
                <td>
                  <button className="std-button" onClick={maxMoney}>
                    Max one
                  </button>
                </td>
                <td>
                  <button className="std-button" onClick={maxAllMoney}>
                    Max all
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Companies</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="text">Company:</span>
                </td>
                <td colSpan={3}>
                  <select
                    id="dev-companies-dropdown"
                    className="dropdown"
                    onChange={setCompanyDropdown}
                    value={company}
                  >
                    {companies}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Reputation:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="reputation"
                    add={modifyCompanyRep(1)}
                    subtract={modifyCompanyRep(-1)}
                    reset={resetCompanyRep}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">Favor:</span>
                </td>
                <td>
                  <ValueAdjusterComponent
                    title="favor"
                    add={modifyCompanyFavor(1)}
                    subtract={modifyCompanyFavor(-1)}
                    reset={resetCompanyFavor}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">All Reputation:</span>
                </td>
                <td>
                  <button className="std-button" onClick={tonsOfRepCompanies}>
                    Tons
                  </button>
                  <button className="std-button" onClick={resetAllRepCompanies}>
                    Reset
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text">All Favor:</span>
                </td>
                <td>
                  <button className="std-button" onClick={tonsOfFavorCompanies}>
                    Tons
                  </button>
                  <button className="std-button" onClick={resetAllFavorCompanies}>
                    Reset
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {props.player.bladeburner instanceof Bladeburner && (
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Bladeburner</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span className="text">Rank:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={addTonsBladeburnerRank}>
                      Tons
                    </button>
                  </td>
                  <td>
                    <ValueAdjusterComponent
                      title="rank"
                      add={modifyBladeburnerRank(1)}
                      subtract={modifyBladeburnerRank(-1)}
                      reset={resetBladeburnerRank}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text">Cycles:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={addTonsBladeburnerCycles}>
                      Tons
                    </button>
                  </td>
                  <td>
                    <ValueAdjusterComponent
                      title="cycles"
                      add={modifyBladeburnerCycles(1)}
                      subtract={modifyBladeburnerCycles(-1)}
                      reset={resetBladeburnerCycles}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {props.player.inGang() && (
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Gang</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span className="text">Cycles:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={addTonsGangCycles}>
                      Tons
                    </button>
                  </td>
                  <td>
                    <ValueAdjusterComponent
                      title="cycles"
                      add={modifyGangCycles(1)}
                      subtract={modifyGangCycles(-1)}
                      reset={resetGangCycles}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {props.player.hasCorporation() && (
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Corporation</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <button className="std-button" onClick={addTonsCorporationFunds}>
                      Tons of funds
                    </button>
                    <button className="std-button" onClick={resetCorporationFunds}>
                      Reset funds
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text">Cycles:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={addTonsCorporationCycles}>
                      Tons
                    </button>
                  </td>
                  <td>
                    <ValueAdjusterComponent
                      title="cycles"
                      add={modifyCorporationCycles(1)}
                      subtract={modifyCorporationCycles(-1)}
                      reset={resetCorporationCycles}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button className="std-button" onClick={finishCorporationProducts}>
                      Finish products
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button className="std-button" onClick={addCorporationResearch}>
                      Tons of research
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Coding Contracts</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <button className="std-button" onClick={generateRandomContract}>
                    Generate Random Contract
                  </button>
                  <button className="std-button" onClick={generateRandomContractOnHome}>
                    Generate Random Contract on Home Comp
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    id="contract-types-dropdown"
                    className="dropdown"
                    onChange={setCodingcontractDropdown}
                    value={codingcontract}
                  >
                    {contractTypes}
                  </select>
                  <button className="std-button" onClick={specificContract}>
                    Generate Specified Contract Type on Home Comp
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {props.player.hasWseAccount && (
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Stock Market</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span className="text">Symbol:</span>
                  </td>
                  <td>
                    <input
                      id="dev-stock-symbol"
                      className="text-input"
                      type="text"
                      placeholder="symbol/'all'"
                      onChange={setStockSymbolField}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text">Price:</span>
                  </td>
                  <td>
                    <input
                      id="dev-stock-price"
                      className="text-input"
                      type="number"
                      placeholder="$$$"
                      onChange={setStockPriceField}
                    />
                    <button className="std-button" onClick={doSetStockPrice}>
                      Set
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text">Caps:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={viewStockCaps}>
                      View stock caps
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {props.player.sleeves.length > 0 && (
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Sleeves</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <span className="text">Shock:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={sleeveMaxAllShock}>
                      Max all
                    </button>
                  </td>
                  <td>
                    <button className="std-button" onClick={sleeveClearAllShock}>
                      Clear all
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text">Sync:</span>
                  </td>
                  <td>
                    <button className="std-button" onClick={sleeveSyncMaxAll}>
                      Max all
                    </button>
                  </td>
                  <td>
                    <button className="std-button" onClick={sleeveSyncClearAll}>
                      Clear all
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Offline time skip:</h2>
          </div>
          <div className="row">
            <button className="std-button" onClick={timeskip(60 * 1000)}>
              1 minute
            </button>
            <button className="std-button" onClick={timeskip(60 * 60 * 1000)}>
              1 hour
            </button>
            <button className="std-button" onClick={timeskip(24 * 60 * 60 * 1000)}>
              1 day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}