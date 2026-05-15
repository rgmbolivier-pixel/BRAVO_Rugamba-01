from django.urls import path
from .views import WastePredictionView, DemandForecastView, AnomalyInsightView, DashboardSummaryView, NetworkStatsView, BranchPerformanceView

urlpatterns = [
    path('predict-waste/', WastePredictionView.as_view(), name='predict-waste'),
    path('demand-forecast/', DemandForecastView.as_view(), name='demand-forecast'),
    path('anomaly-insight/', AnomalyInsightView.as_view(), name='anomaly-insight'),
    path('dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('network-stats/', NetworkStatsView.as_view(), name='network-stats'),
    path('branch-performance/', BranchPerformanceView.as_view(), name='branch-performance'),
]
