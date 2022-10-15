import React from "react";
import { Switch, Route } from "react-router-dom";
import DiseaseForm from "../components/Disease/Form";
import VaccinationCreateForm from "../components/Vaccinations/Form";
import ClinicForm from "../components/Clinic/Form";
import AdminReport from "../components/Report/AdminReport";
import Layout from "../components/Layout";
const AdminRoutes = () => {
  return (
    <Switch>
      <Layout>
        <Route path="/admin/disease" exact>
          <DiseaseForm />
        </Route>
        <Route path="/admin/clinic" exact>
          <ClinicForm />
        </Route>
        <Route path="/admin/vaccine" exact>
          <VaccinationCreateForm />
        </Route>
        <Route path="/admin/report">
          <AdminReport />
        </Route>
      </Layout>
    </Switch>
  );
};

export default AdminRoutes;
