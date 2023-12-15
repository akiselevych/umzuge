//styles
import styles from "./index.module.scss";
//libs
import React from "react";
//types
import {
  webPagesEnum,
  webPagesRepeatedBlocksEnum,
  webPagesLocalPages,
} from "../types";
import classNames from "classnames";

const baseUrl = "http://185.31.210.189:8080/de";
const pageUrls: Record<webPagesEnum, string> = {
  "Home-page": `${baseUrl}/`,
  "Ueber-uns": `${baseUrl}/ueber-uns`,
  "Unser-team": `${baseUrl}/unser-team`,
  Einlagerung: `${baseUrl}/einlagerung`,
  Privatumzug: `${baseUrl}/privatumzug`,
  Firmenumzug: `${baseUrl}/firmenumzug`,
  Stellenangebote: `${baseUrl}/jobs`,
  "Ein-und-Auspackservice": `${baseUrl}/ein-und-auspackservice`,
  Mobelmontage: `${baseUrl}/moebeldemontage-und-montage`,
  Verpackungsmaterial: `${baseUrl}/verpackungsmaterial`,
  Entruempelung: `${baseUrl}/entruempelung`,
  Halteverbot: `${baseUrl}/haltverbotszone`,
  Endreinigung: `${baseUrl}/endreinigung`,
  Kontakt: `${baseUrl}/kontakt`,
  Ratgeber: `${baseUrl}/ratgeber`,
  "Not-found": `${baseUrl}/not-found`,
  "Beratung-anfordern": `${baseUrl}/preise-calculator/beratung-anfordern?desiredDate=2023-11-22&floorNew=0&floorOld=0&moveIn=34%2C+6-%D0%B9+%D0%BC%D1%96%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD+%D0%9E%D1%81%D0%BE%D0%BA%D0%BE%D1%80%D0%BA%D1%96%D0%B2%2C+%D0%9E%D1%81%D0%BE%D0%BA%D0%BE%D1%80%D0%BA%D0%B8%2C+%D0%9A%D0%B8%D1%97%D0%B2%2C+02140%2C+%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0&space=80&statementAddress=36%2C+%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%84%D0%BB%D0%B8%D0%B7%D0%B0%D0%B2%D0%B5%D1%82%D0%B8+%D0%A7%D0%B0%D0%B2%D0%B4%D0%B0%D1%80%2C+%C2%AB%D0%9C%D0%BE%D0%BB%D0%BE%D0%B4%D1%96%D0%B6%D0%BD%D0%B8%D0%B9+%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B0%D0%BB%C2%BB%2C+%D0%9E%D1%81%D0%BE%D0%BA%D0%BE%D1%80%D0%BA%D0%B8%2C+%D0%9A%D0%B8%D1%97%D0%B2%2C+02140%2C+%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0`,
  "Price-page": `${baseUrl}/preise-calculator`,
  "Besichtigungstermin-anfragen": `${baseUrl}/preise-calculator/besichtigungstermin-anfragen?desiredDate=2023-11-22&floorNew=0&floorOld=0&moveIn=34%2C%206-й%20мікрорайон%20Осокорків%2C%20Осокорки%2C%20Київ%2C%2002140%2C%20Україна&space=80&statementAddress=36%2C%20вулиця%20Єлизавети%20Чавдар%2C%20«Молодіжний%20квартал»%2C%20Осокорки%2C%20Київ%2C%2002140%2C%20Україна`,
  Umzugscheckliste: `${baseUrl}/checkliste`,
  Dienstleistungsqualitat: `${baseUrl}/dienstleistungsqualitat`,
  AGB: `${baseUrl}/agb`,
  Datenschutz: `${baseUrl}/datenschutz`,
  Impressum: `${baseUrl}/impressum`,
  Bonnigheim: `${baseUrl}/bonnigheim`,
  Sersheim: `${baseUrl}/sersheim`,
  Besigheim: `${baseUrl}/umzugsunternehmen-besigheim`,
  "Bietigheim-Bissingen": `${baseUrl}/umzugsunternehmen-bietigheim-bissingen`,
  "Freiberg-am-Neckar": `${baseUrl}/umzugsunternehmen-freiberg-am-neckar`,
  Markgroeningen: `${baseUrl}/umzugsunternehmen-markgroeningen`,
  Moeglingen: `${baseUrl}/umzugsunternehmen-moeglingen`,
  Stuttgart: `${baseUrl}/umzugsunternehmen-stuttgart`,
};

type Props = {
  onTabClick: (
    arg: webPagesEnum | webPagesRepeatedBlocksEnum | webPagesLocalPages
  ) => void;
  activeTab: webPagesEnum | webPagesRepeatedBlocksEnum | webPagesLocalPages;
};

const firstLatterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const SideBar = ({ onTabClick, activeTab }: Props) => {
  return (
    <div className={styles.container}>
      <p className={styles.bigDivider}>PAGES</p>
      {Object.entries(webPagesEnum).map((page, i) => (
        <React.Fragment key={i}>
          <div
            className={classNames(
              styles.tab,
              activeTab === page[1] ? styles.activeTab : ""
            )}
            onClick={() => onTabClick(page[1])}
          >
            {firstLatterToUpperCase(page[1])}
            <a target="_blank" href={pageUrls[page[1]]}>
              url
            </a>
          </div>
          {i !== Object.entries(webPagesEnum).length - 1 && (
            <span className={styles.divider}></span>
          )}
        </React.Fragment>
      ))}
      <p className={styles.bigDivider}>REPEATED BLOCKS</p>
      {Object.entries(webPagesRepeatedBlocksEnum).map((page, i) => (
        <React.Fragment key={i}>
          <div
            className={classNames(
              styles.tab,
              activeTab === page[1] ? styles.activeTab : ""
            )}
            onClick={() => onTabClick(page[1])}
          >
            {firstLatterToUpperCase(page[1])}
          </div>
          {i !== Object.entries(webPagesEnum).length - 1 && (
            <span className={styles.divider}></span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideBar;
