import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ScheduleEntry } from "./api";

const POLL_MS = 15_000; // 15s — see roadmap Phase 5, gives a "live" feel without WebSockets

export function useLatestReading(stationId: string) {
  return useQuery({
    queryKey: ["reading", stationId, "latest"],
    queryFn: () => api.readings.latest(stationId),
    refetchInterval: POLL_MS,
  });
}

export function useAlerts(stationId: string, resolved = false) {
  return useQuery({
    queryKey: ["alerts", stationId, resolved],
    queryFn: () => api.alerts.list(stationId, resolved),
    refetchInterval: POLL_MS,
  });
}

export function useAnalytics(stationId: string, range = "7d") {
  return useQuery({
    queryKey: ["analytics", stationId, range],
    queryFn: () => api.analytics.get(stationId, range),
    refetchInterval: POLL_MS * 4, // charts don't need to refresh as often
  });
}

export function useSchedule(stationId: string) {
  return useQuery({
    queryKey: ["schedule", stationId],
    queryFn: () => api.schedule.list(stationId),
  });
}

export function useUpdateSchedule(stationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entries: Omit<ScheduleEntry, "id" | "stationId">[]) =>
      api.schedule.update(stationId, entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", stationId] });
    },
  });
}

export function useResolveAlert(stationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => api.alerts.resolve(stationId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", stationId] });
    },
  });
}
