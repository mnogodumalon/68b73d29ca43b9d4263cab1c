// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { BproBeteiligte, BproAufgaben, BproMitarbeiter, BproBeschlussprotokoll, BproHowto, BproBerichte, BproTemplates } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1];
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- BPRO___BETEILIGTE ---
  static async getBproBeteiligte(): Promise<BproBeteiligte[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BETEILIGTE}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproBeteiligteEntry(id: string): Promise<BproBeteiligte | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BETEILIGTE}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproBeteiligteEntry(fields: BproBeteiligte['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_BETEILIGTE}/records`, { fields });
  }
  static async updateBproBeteiligteEntry(id: string, fields: Partial<BproBeteiligte['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_BETEILIGTE}/records/${id}`, { fields });
  }
  static async deleteBproBeteiligteEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_BETEILIGTE}/records/${id}`);
  }

  // --- BPRO___AUFGABEN ---
  static async getBproAufgaben(): Promise<BproAufgaben[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_AUFGABEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproAufgabenEntry(id: string): Promise<BproAufgaben | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_AUFGABEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproAufgabenEntry(fields: BproAufgaben['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_AUFGABEN}/records`, { fields });
  }
  static async updateBproAufgabenEntry(id: string, fields: Partial<BproAufgaben['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_AUFGABEN}/records/${id}`, { fields });
  }
  static async deleteBproAufgabenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_AUFGABEN}/records/${id}`);
  }

  // --- BPRO___MITARBEITER ---
  static async getBproMitarbeiter(): Promise<BproMitarbeiter[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_MITARBEITER}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproMitarbeiterEntry(id: string): Promise<BproMitarbeiter | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_MITARBEITER}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproMitarbeiterEntry(fields: BproMitarbeiter['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_MITARBEITER}/records`, { fields });
  }
  static async updateBproMitarbeiterEntry(id: string, fields: Partial<BproMitarbeiter['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_MITARBEITER}/records/${id}`, { fields });
  }
  static async deleteBproMitarbeiterEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_MITARBEITER}/records/${id}`);
  }

  // --- BPRO___BESCHLUSSPROTOKOLL ---
  static async getBproBeschlussprotokoll(): Promise<BproBeschlussprotokoll[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BESCHLUSSPROTOKOLL}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproBeschlussprotokollEntry(id: string): Promise<BproBeschlussprotokoll | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BESCHLUSSPROTOKOLL}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproBeschlussprotokollEntry(fields: BproBeschlussprotokoll['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_BESCHLUSSPROTOKOLL}/records`, { fields });
  }
  static async updateBproBeschlussprotokollEntry(id: string, fields: Partial<BproBeschlussprotokoll['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_BESCHLUSSPROTOKOLL}/records/${id}`, { fields });
  }
  static async deleteBproBeschlussprotokollEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_BESCHLUSSPROTOKOLL}/records/${id}`);
  }

  // --- BPRO___HOWTO ---
  static async getBproHowto(): Promise<BproHowto[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_HOWTO}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproHowtoEntry(id: string): Promise<BproHowto | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_HOWTO}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproHowtoEntry(fields: BproHowto['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_HOWTO}/records`, { fields });
  }
  static async updateBproHowtoEntry(id: string, fields: Partial<BproHowto['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_HOWTO}/records/${id}`, { fields });
  }
  static async deleteBproHowtoEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_HOWTO}/records/${id}`);
  }

  // --- BPRO___BERICHTE ---
  static async getBproBerichte(): Promise<BproBerichte[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BERICHTE}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproBerichteEntry(id: string): Promise<BproBerichte | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_BERICHTE}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproBerichteEntry(fields: BproBerichte['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_BERICHTE}/records`, { fields });
  }
  static async updateBproBerichteEntry(id: string, fields: Partial<BproBerichte['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_BERICHTE}/records/${id}`, { fields });
  }
  static async deleteBproBerichteEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_BERICHTE}/records/${id}`);
  }

  // --- BPRO___TEMPLATES ---
  static async getBproTemplates(): Promise<BproTemplates[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_TEMPLATES}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBproTemplate(id: string): Promise<BproTemplates | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BPRO_TEMPLATES}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBproTemplate(fields: BproTemplates['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BPRO_TEMPLATES}/records`, { fields });
  }
  static async updateBproTemplate(id: string, fields: Partial<BproTemplates['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BPRO_TEMPLATES}/records/${id}`, { fields });
  }
  static async deleteBproTemplate(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BPRO_TEMPLATES}/records/${id}`);
  }

}