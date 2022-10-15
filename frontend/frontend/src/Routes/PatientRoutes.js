import React from "react";
import { Switch, Route } from "react-router-dom";
import Checkin from "../components/Checkin/Checkin";
import Reservation from "../components/Reservation/Reservation";
import VaccinationsDue from "../components/Vaccinations/DueList";
import VaccinationsHistory from "../components/Vaccinations/History";
import Layout from "../components/Layout";
import BookReservation from "../components/Reservation/BookReservation";
import PatientReport from "../components/Report/PatientReport";
export const PatientRoutes = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/patient/checkin" exact>
          <Checkin />
        </Route>
        <Route path="/patient/appointments" exact>
          <Reservation />
        </Route>
        <Route path="/patient/appointments/:appointmentId/edit" exact>
          <BookReservation />
        </Route>
        <Route path="/patient/appointments/new" exact>
          <BookReservation />
        </Route>
        <Route path="/patient/vaccination/history" exact>
          <VaccinationsHistory />
        </Route>
        <Route path="/patient/vaccination/dues" exact>
          <VaccinationsDue />
        </Route>
        <Route path="/patient/dashboard" exact>
          <VaccinationsDue />
        </Route>
        <Route path="/patient/report" exact>
          <PatientReport />
        </Route>
      </Layout>
    </Switch>
  );
};
