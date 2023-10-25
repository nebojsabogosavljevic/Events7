import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api'
});

export interface Event {
  id: string;
  data: {
    frId: string;
    name: string;
    description: string;
    priority: string;
    type: string;
  };
}

export const getEvents = async () => {
  const response = await apiClient.get(`/events`);
  return response.data;
};

export const getEvent = async (id: string) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event: Event) => {
  const response = await apiClient.post(`/events`, event.data);
  return response.data;
};

export const updateEvent = async (id: string, event: Event) => {
  const response = await apiClient.patch(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};

export const deleteSelectedEvents = async (ids: string[]) => {
  const response = await apiClient.delete(`/events/delete`, { data: { ids }});
  return response.data;
}