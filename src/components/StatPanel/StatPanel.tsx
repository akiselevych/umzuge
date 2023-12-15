//libs
import { FC } from "react";
// Styles
import styles from "components/StatPanel/StatPanel.module.scss";
//types
import { StatPanelProps } from "types/index";

const StatPanel: FC<StatPanelProps> = ({ content }) => {
    return (
        <div className={styles.statPanel}>
            {content.map((item, i) => {
                return (
                    <div className={styles.item} key={i}>
                        <div className={styles.itemLabel}>{item.label}</div>
                        <div className={styles.itemData}>{item.data}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatPanel;
