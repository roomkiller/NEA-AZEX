import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Modules from "./Modules";

import Security from "./Security";

import Documentation from "./Documentation";

import TacticalDisplay from "./TacticalDisplay";

import Configuration from "./Configuration";

import NetworkManager from "./NetworkManager";

import CrisisManager from "./CrisisManager";

import ScenarioGenerator from "./ScenarioGenerator";

import BackupManager from "./BackupManager";

import SystemAnalysis from "./SystemAnalysis";

import ProtocolDocumentation from "./ProtocolDocumentation";

import EventPredictions from "./EventPredictions";

import WeakSignals from "./WeakSignals";

import TrendAnalysis from "./TrendAnalysis";

import LegalNotice from "./LegalNotice";

import PostDeployment from "./PostDeployment";

import SystemValuation from "./SystemValuation";

import AntiPiracy from "./AntiPiracy";

import DeepModuleAnalysis from "./DeepModuleAnalysis";

import UltraDeepAnalysis from "./UltraDeepAnalysis";

import CorrelationEngine from "./CorrelationEngine";

import UpdateManagement from "./UpdateManagement";

import CascadePredictionSystem from "./CascadePredictionSystem";

import ModuleAutonomization from "./ModuleAutonomization";

import UserManagement from "./UserManagement";

import DataSourceConfiguration from "./DataSourceConfiguration";

import OSINTSourceAssignment from "./OSINTSourceAssignment";

import EncryptionActivation from "./EncryptionActivation";

import SystemInitialization from "./SystemInitialization";

import AnalysisAccelerator from "./AnalysisAccelerator";

import SystemStatus from "./SystemStatus";

import ConfigurationSourcesComplete from "./ConfigurationSourcesComplete";

import UserDashboard from "./UserDashboard";

import TechnicianDashboard from "./TechnicianDashboard";

import DeveloperDashboard from "./DeveloperDashboard";

import AdminDashboard from "./AdminDashboard";

import Home from "./Home";

import SystemAudit from "./SystemAudit";

import AccreditationManagement from "./AccreditationManagement";

import SubscriptionManagement from "./SubscriptionManagement";

import MySubscription from "./MySubscription";

import Pricing from "./Pricing";

import StripeSetup from "./StripeSetup";

import EmailManagement from "./EmailManagement";

import UpdateDashboard from "./UpdateDashboard";

import DiscoveryDashboard from "./DiscoveryDashboard";

import SoloDashboard from "./SoloDashboard";

import TeamDashboard from "./TeamDashboard";

import EnterpriseDashboard from "./EnterpriseDashboard";

import CompetitiveValuation from "./CompetitiveValuation";

import NotFound from "./NotFound";

import SoftwareAssetValuation from "./SoftwareAssetValuation";

import EmergencyAuditProtocol from "./EmergencyAuditProtocol";

import SystemNexus from "./SystemNexus";

import PredictionEngine from "./PredictionEngine";

import BotMacroManager from "./BotMacroManager";

import BotMacroExecutionEngine from "./BotMacroExecutionEngine";

import UserActivityLog from "./UserActivityLog";

import ChimeraProtocol from "./ChimeraProtocol";

import GlobalAnalysisEngine from "./GlobalAnalysisEngine";

import JanusProtocol from "./JanusProtocol";

import LeviathanProtocol from "./LeviathanProtocol";

import PrometheusProtocol from "./PrometheusProtocol";

import MasterDashboard from "./MasterDashboard";

import MilitaryIntelligence from "./MilitaryIntelligence";

import PublicHealthMonitor from "./PublicHealthMonitor";

import InvestigativeJournalism from "./InvestigativeJournalism";

import DiplomaticIntelligence from "./DiplomaticIntelligence";

import FinancialIntelligence from "./FinancialIntelligence";

import ClimateWeatherCenter from "./ClimateWeatherCenter";

import LawEnforcementCenter from "./LawEnforcementCenter";

import SystemIndex from "./SystemIndex";

import EnergyCenter from "./EnergyCenter";

import MaritimeIntelligence from "./MaritimeIntelligence";

import SpaceCenter from "./SpaceCenter";

import SupplyChainIntelligence from "./SupplyChainIntelligence";

import CorporateIntelligence from "./CorporateIntelligence";

import CriticalInfrastructure from "./CriticalInfrastructure";

import AgricultureSecurityCenter from "./AgricultureSecurityCenter";

import TelecommunicationsCenter from "./TelecommunicationsCenter";

import TradeIntelligence from "./TradeIntelligence";

import MigrationBorderSecurity from "./MigrationBorderSecurity";

import TechnologyInnovationCenter from "./TechnologyInnovationCenter";

import MediaInfluenceCenter from "./MediaInfluenceCenter";

import LegalIntelligence from "./LegalIntelligence";

import EnvironmentalIntelligence from "./EnvironmentalIntelligence";

import EducationResearchCenter from "./EducationResearchCenter";

import TransportMobilityCenter from "./TransportMobilityCenter";

import WaterResourcesCenter from "./WaterResourcesCenter";

import TourismHospitalityCenter from "./TourismHospitalityCenter";

import ModuleRecoverySystem from "./ModuleRecoverySystem";

import SystemTableOfContents from "./SystemTableOfContents";

import Welcome from "./Welcome";

import FAQ from "./FAQ";

import QuickStartGuide from "./QuickStartGuide";

import SystemDataSeeder from "./SystemDataSeeder";

import GlobalSearch from "./GlobalSearch";

import NotificationCenter from "./NotificationCenter";

import MyFavorites from "./MyFavorites";

import PerformanceMonitoring from "./PerformanceMonitoring";

import OptimizationGuide from "./OptimizationGuide";

import AIControlCenter from "./AIControlCenter";

import AIScenarioBuilder from "./AIScenarioBuilder";

import CollaborativeScenarioView from "./CollaborativeScenarioView";

import CollaborationDashboard from "./CollaborationDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Modules: Modules,
    
    Security: Security,
    
    Documentation: Documentation,
    
    TacticalDisplay: TacticalDisplay,
    
    Configuration: Configuration,
    
    NetworkManager: NetworkManager,
    
    CrisisManager: CrisisManager,
    
    ScenarioGenerator: ScenarioGenerator,
    
    BackupManager: BackupManager,
    
    SystemAnalysis: SystemAnalysis,
    
    ProtocolDocumentation: ProtocolDocumentation,
    
    EventPredictions: EventPredictions,
    
    WeakSignals: WeakSignals,
    
    TrendAnalysis: TrendAnalysis,
    
    LegalNotice: LegalNotice,
    
    PostDeployment: PostDeployment,
    
    SystemValuation: SystemValuation,
    
    AntiPiracy: AntiPiracy,
    
    DeepModuleAnalysis: DeepModuleAnalysis,
    
    UltraDeepAnalysis: UltraDeepAnalysis,
    
    CorrelationEngine: CorrelationEngine,
    
    UpdateManagement: UpdateManagement,
    
    CascadePredictionSystem: CascadePredictionSystem,
    
    ModuleAutonomization: ModuleAutonomization,
    
    UserManagement: UserManagement,
    
    DataSourceConfiguration: DataSourceConfiguration,
    
    OSINTSourceAssignment: OSINTSourceAssignment,
    
    EncryptionActivation: EncryptionActivation,
    
    SystemInitialization: SystemInitialization,
    
    AnalysisAccelerator: AnalysisAccelerator,
    
    SystemStatus: SystemStatus,
    
    ConfigurationSourcesComplete: ConfigurationSourcesComplete,
    
    UserDashboard: UserDashboard,
    
    TechnicianDashboard: TechnicianDashboard,
    
    DeveloperDashboard: DeveloperDashboard,
    
    AdminDashboard: AdminDashboard,
    
    Home: Home,
    
    SystemAudit: SystemAudit,
    
    AccreditationManagement: AccreditationManagement,
    
    SubscriptionManagement: SubscriptionManagement,
    
    MySubscription: MySubscription,
    
    Pricing: Pricing,
    
    StripeSetup: StripeSetup,
    
    EmailManagement: EmailManagement,
    
    UpdateDashboard: UpdateDashboard,
    
    DiscoveryDashboard: DiscoveryDashboard,
    
    SoloDashboard: SoloDashboard,
    
    TeamDashboard: TeamDashboard,
    
    EnterpriseDashboard: EnterpriseDashboard,
    
    CompetitiveValuation: CompetitiveValuation,
    
    NotFound: NotFound,
    
    SoftwareAssetValuation: SoftwareAssetValuation,
    
    EmergencyAuditProtocol: EmergencyAuditProtocol,
    
    SystemNexus: SystemNexus,
    
    PredictionEngine: PredictionEngine,
    
    BotMacroManager: BotMacroManager,
    
    BotMacroExecutionEngine: BotMacroExecutionEngine,
    
    UserActivityLog: UserActivityLog,
    
    ChimeraProtocol: ChimeraProtocol,
    
    GlobalAnalysisEngine: GlobalAnalysisEngine,
    
    JanusProtocol: JanusProtocol,
    
    LeviathanProtocol: LeviathanProtocol,
    
    PrometheusProtocol: PrometheusProtocol,
    
    MasterDashboard: MasterDashboard,
    
    MilitaryIntelligence: MilitaryIntelligence,
    
    PublicHealthMonitor: PublicHealthMonitor,
    
    InvestigativeJournalism: InvestigativeJournalism,
    
    DiplomaticIntelligence: DiplomaticIntelligence,
    
    FinancialIntelligence: FinancialIntelligence,
    
    ClimateWeatherCenter: ClimateWeatherCenter,
    
    LawEnforcementCenter: LawEnforcementCenter,
    
    SystemIndex: SystemIndex,
    
    EnergyCenter: EnergyCenter,
    
    MaritimeIntelligence: MaritimeIntelligence,
    
    SpaceCenter: SpaceCenter,
    
    SupplyChainIntelligence: SupplyChainIntelligence,
    
    CorporateIntelligence: CorporateIntelligence,
    
    CriticalInfrastructure: CriticalInfrastructure,
    
    AgricultureSecurityCenter: AgricultureSecurityCenter,
    
    TelecommunicationsCenter: TelecommunicationsCenter,
    
    TradeIntelligence: TradeIntelligence,
    
    MigrationBorderSecurity: MigrationBorderSecurity,
    
    TechnologyInnovationCenter: TechnologyInnovationCenter,
    
    MediaInfluenceCenter: MediaInfluenceCenter,
    
    LegalIntelligence: LegalIntelligence,
    
    EnvironmentalIntelligence: EnvironmentalIntelligence,
    
    EducationResearchCenter: EducationResearchCenter,
    
    TransportMobilityCenter: TransportMobilityCenter,
    
    WaterResourcesCenter: WaterResourcesCenter,
    
    TourismHospitalityCenter: TourismHospitalityCenter,
    
    ModuleRecoverySystem: ModuleRecoverySystem,
    
    SystemTableOfContents: SystemTableOfContents,
    
    Welcome: Welcome,
    
    FAQ: FAQ,
    
    QuickStartGuide: QuickStartGuide,
    
    SystemDataSeeder: SystemDataSeeder,
    
    GlobalSearch: GlobalSearch,
    
    NotificationCenter: NotificationCenter,
    
    MyFavorites: MyFavorites,
    
    PerformanceMonitoring: PerformanceMonitoring,
    
    OptimizationGuide: OptimizationGuide,
    
    AIControlCenter: AIControlCenter,
    
    AIScenarioBuilder: AIScenarioBuilder,
    
    CollaborativeScenarioView: CollaborativeScenarioView,
    
    CollaborationDashboard: CollaborationDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Modules" element={<Modules />} />
                
                <Route path="/Security" element={<Security />} />
                
                <Route path="/Documentation" element={<Documentation />} />
                
                <Route path="/TacticalDisplay" element={<TacticalDisplay />} />
                
                <Route path="/Configuration" element={<Configuration />} />
                
                <Route path="/NetworkManager" element={<NetworkManager />} />
                
                <Route path="/CrisisManager" element={<CrisisManager />} />
                
                <Route path="/ScenarioGenerator" element={<ScenarioGenerator />} />
                
                <Route path="/BackupManager" element={<BackupManager />} />
                
                <Route path="/SystemAnalysis" element={<SystemAnalysis />} />
                
                <Route path="/ProtocolDocumentation" element={<ProtocolDocumentation />} />
                
                <Route path="/EventPredictions" element={<EventPredictions />} />
                
                <Route path="/WeakSignals" element={<WeakSignals />} />
                
                <Route path="/TrendAnalysis" element={<TrendAnalysis />} />
                
                <Route path="/LegalNotice" element={<LegalNotice />} />
                
                <Route path="/PostDeployment" element={<PostDeployment />} />
                
                <Route path="/SystemValuation" element={<SystemValuation />} />
                
                <Route path="/AntiPiracy" element={<AntiPiracy />} />
                
                <Route path="/DeepModuleAnalysis" element={<DeepModuleAnalysis />} />
                
                <Route path="/UltraDeepAnalysis" element={<UltraDeepAnalysis />} />
                
                <Route path="/CorrelationEngine" element={<CorrelationEngine />} />
                
                <Route path="/UpdateManagement" element={<UpdateManagement />} />
                
                <Route path="/CascadePredictionSystem" element={<CascadePredictionSystem />} />
                
                <Route path="/ModuleAutonomization" element={<ModuleAutonomization />} />
                
                <Route path="/UserManagement" element={<UserManagement />} />
                
                <Route path="/DataSourceConfiguration" element={<DataSourceConfiguration />} />
                
                <Route path="/OSINTSourceAssignment" element={<OSINTSourceAssignment />} />
                
                <Route path="/EncryptionActivation" element={<EncryptionActivation />} />
                
                <Route path="/SystemInitialization" element={<SystemInitialization />} />
                
                <Route path="/AnalysisAccelerator" element={<AnalysisAccelerator />} />
                
                <Route path="/SystemStatus" element={<SystemStatus />} />
                
                <Route path="/ConfigurationSourcesComplete" element={<ConfigurationSourcesComplete />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/TechnicianDashboard" element={<TechnicianDashboard />} />
                
                <Route path="/DeveloperDashboard" element={<DeveloperDashboard />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/SystemAudit" element={<SystemAudit />} />
                
                <Route path="/AccreditationManagement" element={<AccreditationManagement />} />
                
                <Route path="/SubscriptionManagement" element={<SubscriptionManagement />} />
                
                <Route path="/MySubscription" element={<MySubscription />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/StripeSetup" element={<StripeSetup />} />
                
                <Route path="/EmailManagement" element={<EmailManagement />} />
                
                <Route path="/UpdateDashboard" element={<UpdateDashboard />} />
                
                <Route path="/DiscoveryDashboard" element={<DiscoveryDashboard />} />
                
                <Route path="/SoloDashboard" element={<SoloDashboard />} />
                
                <Route path="/TeamDashboard" element={<TeamDashboard />} />
                
                <Route path="/EnterpriseDashboard" element={<EnterpriseDashboard />} />
                
                <Route path="/CompetitiveValuation" element={<CompetitiveValuation />} />
                
                <Route path="/NotFound" element={<NotFound />} />
                
                <Route path="/SoftwareAssetValuation" element={<SoftwareAssetValuation />} />
                
                <Route path="/EmergencyAuditProtocol" element={<EmergencyAuditProtocol />} />
                
                <Route path="/SystemNexus" element={<SystemNexus />} />
                
                <Route path="/PredictionEngine" element={<PredictionEngine />} />
                
                <Route path="/BotMacroManager" element={<BotMacroManager />} />
                
                <Route path="/BotMacroExecutionEngine" element={<BotMacroExecutionEngine />} />
                
                <Route path="/UserActivityLog" element={<UserActivityLog />} />
                
                <Route path="/ChimeraProtocol" element={<ChimeraProtocol />} />
                
                <Route path="/GlobalAnalysisEngine" element={<GlobalAnalysisEngine />} />
                
                <Route path="/JanusProtocol" element={<JanusProtocol />} />
                
                <Route path="/LeviathanProtocol" element={<LeviathanProtocol />} />
                
                <Route path="/PrometheusProtocol" element={<PrometheusProtocol />} />
                
                <Route path="/MasterDashboard" element={<MasterDashboard />} />
                
                <Route path="/MilitaryIntelligence" element={<MilitaryIntelligence />} />
                
                <Route path="/PublicHealthMonitor" element={<PublicHealthMonitor />} />
                
                <Route path="/InvestigativeJournalism" element={<InvestigativeJournalism />} />
                
                <Route path="/DiplomaticIntelligence" element={<DiplomaticIntelligence />} />
                
                <Route path="/FinancialIntelligence" element={<FinancialIntelligence />} />
                
                <Route path="/ClimateWeatherCenter" element={<ClimateWeatherCenter />} />
                
                <Route path="/LawEnforcementCenter" element={<LawEnforcementCenter />} />
                
                <Route path="/SystemIndex" element={<SystemIndex />} />
                
                <Route path="/EnergyCenter" element={<EnergyCenter />} />
                
                <Route path="/MaritimeIntelligence" element={<MaritimeIntelligence />} />
                
                <Route path="/SpaceCenter" element={<SpaceCenter />} />
                
                <Route path="/SupplyChainIntelligence" element={<SupplyChainIntelligence />} />
                
                <Route path="/CorporateIntelligence" element={<CorporateIntelligence />} />
                
                <Route path="/CriticalInfrastructure" element={<CriticalInfrastructure />} />
                
                <Route path="/AgricultureSecurityCenter" element={<AgricultureSecurityCenter />} />
                
                <Route path="/TelecommunicationsCenter" element={<TelecommunicationsCenter />} />
                
                <Route path="/TradeIntelligence" element={<TradeIntelligence />} />
                
                <Route path="/MigrationBorderSecurity" element={<MigrationBorderSecurity />} />
                
                <Route path="/TechnologyInnovationCenter" element={<TechnologyInnovationCenter />} />
                
                <Route path="/MediaInfluenceCenter" element={<MediaInfluenceCenter />} />
                
                <Route path="/LegalIntelligence" element={<LegalIntelligence />} />
                
                <Route path="/EnvironmentalIntelligence" element={<EnvironmentalIntelligence />} />
                
                <Route path="/EducationResearchCenter" element={<EducationResearchCenter />} />
                
                <Route path="/TransportMobilityCenter" element={<TransportMobilityCenter />} />
                
                <Route path="/WaterResourcesCenter" element={<WaterResourcesCenter />} />
                
                <Route path="/TourismHospitalityCenter" element={<TourismHospitalityCenter />} />
                
                <Route path="/ModuleRecoverySystem" element={<ModuleRecoverySystem />} />
                
                <Route path="/SystemTableOfContents" element={<SystemTableOfContents />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/QuickStartGuide" element={<QuickStartGuide />} />
                
                <Route path="/SystemDataSeeder" element={<SystemDataSeeder />} />
                
                <Route path="/GlobalSearch" element={<GlobalSearch />} />
                
                <Route path="/NotificationCenter" element={<NotificationCenter />} />
                
                <Route path="/MyFavorites" element={<MyFavorites />} />
                
                <Route path="/PerformanceMonitoring" element={<PerformanceMonitoring />} />
                
                <Route path="/OptimizationGuide" element={<OptimizationGuide />} />
                
                <Route path="/AIControlCenter" element={<AIControlCenter />} />
                
                <Route path="/AIScenarioBuilder" element={<AIScenarioBuilder />} />
                
                <Route path="/CollaborativeScenarioView" element={<CollaborativeScenarioView />} />
                
                <Route path="/CollaborationDashboard" element={<CollaborationDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}