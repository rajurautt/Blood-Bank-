import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import API from "../../services/API";
import "../../styles/AdminHome.css";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboard, setDashboard] = useState({
    donarData: [],
    hospitalData: [],
    orgData: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [donarRes, hospitalRes, orgRes] = await Promise.all([
        API.get("/admin/donar-list"),
        API.get("/admin/hospital-list"),
        API.get("/admin/org-list"),
      ]);

      setDashboard({
        donarData: donarRes?.data?.donarData || [],
        hospitalData: hospitalRes?.data?.hospitalData || [],
        orgData: orgRes?.data?.orgData || [],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalDonors = dashboard.donarData.length;
    const totalHospitals = dashboard.hospitalData.length;
    const totalOrganisations = dashboard.orgData.length;

    return [
      {
        label: "Donors",
        count: totalDonors,
        icon: "fa-hand-holding-droplet",
      },
      {
        label: "Hospitals",
        count: totalHospitals,
        icon: "fa-hospital",
      },
      {
        label: "Organisations",
        count: totalOrganisations,
        icon: "fa-building-ngo",
      },
      {
        label: "Total Network",
        count: totalDonors + totalHospitals + totalOrganisations,
        icon: "fa-chart-line",
      },
    ];
  }, [dashboard]);

  const recentUsers = useMemo(() => {
    const mergedUsers = [
      ...dashboard.donarData,
      ...dashboard.hospitalData,
      ...dashboard.orgData,
    ];

    return mergedUsers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [dashboard]);

  return (
    <Layout>
      <div className="admin-dashboard container-fluid py-4 px-3 px-lg-4">
        <div className="admin-hero">
          <div>
            <p className="admin-overline mb-2">Administration Panel</p>
            <h1 className="admin-title mb-1">Welcome back, {user?.name}</h1>
            <p className="admin-subtitle mb-0">
              Monitor registrations and keep the blood network healthy.
            </p>
          </div>
          <div className="admin-status-pill">
            <span className="pulse-dot"></span>
            Live data
          </div>
        </div>

        <div className="row g-3 mt-1">
          {stats.map((item) => (
            <div className="col-12 col-sm-6 col-xl-3" key={item.label}>
              <div className="stat-card">
                <div>
                  <p className="stat-label">{item.label}</p>
                  <h3 className="stat-value">{item.count}</h3>
                </div>
                <div className="stat-icon-wrap">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mt-2">
          <div className="col-12 col-xl-7">
            <div className="dashboard-card h-100">
              <h5 className="mb-3">Platform Highlights</h5>
              <div className="highlight-grid">
                <div className="highlight-item">
                  <p className="highlight-title">Coverage</p>
                  <h4>
                    {dashboard.orgData.length > 0
                      ? Math.max(
                          1,
                          Math.round(
                            (dashboard.hospitalData.length /
                              dashboard.orgData.length) *
                              100
                          )
                        )
                      : 0}
                    %
                  </h4>
                </div>
                <div className="highlight-item">
                  <p className="highlight-title">Donor to Hospital Ratio</p>
                  <h4>
                    {dashboard.hospitalData.length > 0
                      ? (dashboard.donarData.length / dashboard.hospitalData.length).toFixed(1)
                      : "0.0"}
                  </h4>
                </div>
              </div>
              <p className="mb-0 text-secondary mt-3">
                This dashboard gives you a quick operational snapshot of active
                members in your blood bank ecosystem.
              </p>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="dashboard-card h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Recent Registrations</h5>
                <span className="table-chip">Last 6</span>
              </div>

              {loading ? (
                <p className="text-secondary mb-0">Loading recent users...</p>
              ) : recentUsers.length === 0 ? (
                <p className="text-secondary mb-0">No users found yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless mb-0 recent-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((item) => (
                        <tr key={item._id}>
                          <td>
                            {item.name || item.hospitalName || item.organisationName}
                          </td>
                          <td className="text-capitalize">{item.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
