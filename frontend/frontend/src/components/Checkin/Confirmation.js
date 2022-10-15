import React from "react";
import styles from "./Checkin.module.css";
export const Confirmation = ({ message, isError }) => {
  return (
    <div className={styles.cardConfirmation}>
      <div
        style={{
          borderRadius: "200px",
          height: "200px",
          width: "200px",
          background: "#F8FAF5",
          margin: "0 auto",
        }}
      >
        {isError ? (
          <i className={styles.successIcon} style={{ color: "#ed4766" }}>
            X
          </i>
        ) : (
          <i className={styles.successIcon}>✓</i>
        )}
      </div>
      {isError && <p className={styles.failureMessage}>Failed</p>}
      {!isError && <p className={styles.successMessage}>Success</p>}

      <p className={styles.message}>{message}</p>
    </div>
  );
};
