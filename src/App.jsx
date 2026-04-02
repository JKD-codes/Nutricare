import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MealDetail from './pages/MealDetail';
import ShoppingList from './pages/ShoppingList';
import WeeklyReport from './pages/WeeklyReport';
import Layout from './components/Layout';
import BootScreen from './components/BootScreen';
import { isOnboarded, getProfile, getMealPlan } from './utils/storage';

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [mealPlanData, setMealPlanData] = useState(null);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    setOnboarded(isOnboarded());
    setProfile(getProfile());
    setMealPlanData(getMealPlan());
  }, []);

  const handleOnboardingComplete = (newProfile, newPlan) => {
    setProfile(newProfile);
    setMealPlanData(newPlan);
    setOnboarded(true);
  };

  const handlePlanRegenerate = (newPlan) => {
    setMealPlanData(newPlan);
  };

  return (
    <Router>
      {showBoot && <BootScreen onComplete={() => setShowBoot(false)} />}
      <div style={{ opacity: showBoot ? 0 : 1, transition: 'opacity 0.5s ease-in', height: '100%' }}>
        <Routes>
          <Route path="/" element={
            onboarded ? <Navigate to="/dashboard" replace /> : <Landing />
          } />
          <Route path="/onboarding" element={
            <Onboarding onComplete={handleOnboardingComplete} />
          } />
          <Route path="/dashboard" element={
            onboarded ? (
              <Layout profile={profile} condition={profile?.health?.primaryCondition}>
                <Dashboard
                  profile={profile}
                  mealPlanData={mealPlanData}
                  onRegenerate={handlePlanRegenerate}
                />
              </Layout>
            ) : <Navigate to="/" replace />
          } />
          <Route path="/meal/:dayIndex/:mealIndex" element={
            onboarded ? (
              <Layout profile={profile} condition={profile?.health?.primaryCondition}>
                <MealDetail mealPlanData={mealPlanData} />
              </Layout>
            ) : <Navigate to="/" replace />
          } />
          <Route path="/shopping" element={
            onboarded ? (
              <Layout profile={profile} condition={profile?.health?.primaryCondition}>
                <ShoppingList mealPlanData={mealPlanData} />
              </Layout>
            ) : <Navigate to="/" replace />
          } />
          <Route path="/report" element={
            onboarded ? (
              <Layout profile={profile} condition={profile?.health?.primaryCondition}>
                <WeeklyReport
                  mealPlanData={mealPlanData}
                  profile={profile}
                />
              </Layout>
            ) : <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
