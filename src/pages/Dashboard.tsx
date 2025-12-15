import { useState, useEffect } from 'react';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';
import type { BproBeschlussprotokoll, BproAufgaben, BproMitarbeiter, BproBeteiligte } from '@/types/app';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Icons
import { FileText, CheckCircle2, AlertCircle, Clock, Users, PlusCircle, Calendar, TrendingUp } from 'lucide-react';

// --- TYPES ---
interface DashboardStats {
  totalProtokolle: number;
  offeneProtokolle: number;
  abgeschlosseneProtokolle: number;
  offeneAufgaben: number;
  ueberfaelligeAufgaben: number;
  totalMitarbeiter: number;
}

// --- MAIN COMPONENT ---
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [protokolle, setProtokolle] = useState<BproBeschlussprotokoll[]>([]);
  const [aufgaben, setAufgaben] = useState<BproAufgaben[]>([]);
  const [mitarbeiter, setMitarbeiter] = useState<BproMitarbeiter[]>([]);
  const [beteiligte, setBeteiligte] = useState<BproBeteiligte[]>([]);

  // Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalProtokolle: 0,
    offeneProtokolle: 0,
    abgeschlosseneProtokolle: 0,
    offeneAufgaben: 0,
    ueberfaelligeAufgaben: 0,
    totalMitarbeiter: 0,
  });

  // Dialog State für neues Protokoll
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    zweck: '',
    datum: '',
    ort: '',
    status: 'in_planung' as const,
  });
  const [submitting, setSubmitting] = useState(false);

  // --- DATA LOADING ---
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [protokolleData, aufgabenData, mitarbeiterData, beteiligteData] = await Promise.all([
        LivingAppsService.getBproBeschlussprotokoll(),
        LivingAppsService.getBproAufgaben(),
        LivingAppsService.getBproMitarbeiter(),
        LivingAppsService.getBproBeteiligte(),
      ]);

      setProtokolle(protokolleData);
      setAufgaben(aufgabenData);
      setMitarbeiter(mitarbeiterData);
      setBeteiligte(beteiligteData);

      // Berechne Stats
      calculateStats(protokolleData, aufgabenData, mitarbeiterData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Daten');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(
    protokolleData: BproBeschlussprotokoll[],
    aufgabenData: BproAufgaben[],
    mitarbeiterData: BproMitarbeiter[]
  ) {
    const now = new Date();

    // Protokoll-Stats
    const offeneProtokolle = protokolleData.filter(p =>
      p.fields.status === 'in_planung' || p.fields.status === 'aktuell'
    ).length;

    const abgeschlosseneProtokolle = protokolleData.filter(p =>
      p.fields.status === 'abgeschlossen_archiv' || p.fields.status === 'archiv'
    ).length;

    // Aufgaben-Stats
    const offeneAufgaben = aufgabenData.filter(a => !a.fields.erledigt).length;

    const ueberfaelligeAufgaben = aufgabenData.filter(a => {
      if (a.fields.erledigt || !a.fields.faellig) return false;
      try {
        const fälligDatum = parseISO(a.fields.faellig);
        return isBefore(fälligDatum, now);
      } catch {
        return false;
      }
    }).length;

    setStats({
      totalProtokolle: protokolleData.length,
      offeneProtokolle,
      abgeschlosseneProtokolle,
      offeneAufgaben,
      ueberfaelligeAufgaben,
      totalMitarbeiter: mitarbeiterData.length,
    });
  }

  // --- HANDLERS ---
  async function handleCreateProtokoll(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.zweck || !formData.datum) {
      setError('Zweck und Datum sind Pflichtfelder');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Konvertiere Datum für Living Apps API (date/datetimeminute benötigt YYYY-MM-DDTHH:MM)
      const datumForApi = formData.datum + 'T12:00';

      await LivingAppsService.createBproBeschlussprotokollEntry({
        zweck2: formData.zweck,
        datum: datumForApi,
        ort: formData.ort || undefined,
        status: formData.status,
      });

      // Dialog schließen und Daten neu laden
      setDialogOpen(false);
      setFormData({ zweck: '', datum: '', ort: '', status: 'in_planung' });
      await loadData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
      console.error('Create error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  // --- HELPER FUNCTIONS ---
  function getStatusBadgeVariant(status?: string) {
    switch (status) {
      case 'in_planung': return 'secondary';
      case 'aktuell': return 'default';
      case 'abgeschlossen_archiv': return 'outline';
      case 'archiv': return 'outline';
      default: return 'secondary';
    }
  }

  function getStatusLabel(status?: string) {
    switch (status) {
      case 'in_planung': return 'Vorbereitung';
      case 'aktuell': return 'Offen';
      case 'abgeschlossen_archiv': return 'Abgeschlossen';
      case 'archiv': return 'Archiviert';
      default: return 'Unbekannt';
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return '-';
    try {
      const date = parseISO(dateStr);
      return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
    } catch {
      return dateStr;
    }
  }

  function getMitarbeiterName(mitarbeiterId: string | undefined): string {
    if (!mitarbeiterId) return '-';
    const id = extractRecordId(mitarbeiterId);
    if (!id) return '-';
    const mitarbeiterRecord = mitarbeiter.find(m => m.record_id === id);
    return mitarbeiterRecord?.fields.name || 'Unbekannt';
  }

  // --- RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Beschlussprotokoll Dashboard</h1>
              <p className="text-slate-600 mt-1">Übersicht aller Protokolle, Aufgaben und Beteiligten</p>
            </div>

            {/* Hauptaktion: Neues Protokoll */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Neues Protokoll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateProtokoll}>
                  <DialogHeader>
                    <DialogTitle>Neues Beschlussprotokoll erstellen</DialogTitle>
                    <DialogDescription>
                      Erfassen Sie die Grunddaten für ein neues Protokoll.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zweck">Zweck *</Label>
                      <Input
                        id="zweck"
                        value={formData.zweck}
                        onChange={(e) => setFormData({ ...formData, zweck: e.target.value })}
                        placeholder="z.B. Jahreshauptversammlung 2025"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="datum">Datum *</Label>
                      <Input
                        id="datum"
                        type="date"
                        value={formData.datum}
                        onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ort">Ort</Label>
                      <Input
                        id="ort"
                        value={formData.ort}
                        onChange={(e) => setFormData({ ...formData, ort: e.target.value })}
                        placeholder="z.B. Konferenzraum A"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_planung">Vorbereitung</SelectItem>
                          <SelectItem value="aktuell">Offen</SelectItem>
                          <SelectItem value="abgeschlossen_archiv">Abgeschlossen</SelectItem>
                          <SelectItem value="archiv">Archiviert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Erstelle...' : 'Protokoll erstellen'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Gesamt Protokolle
              </CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProtokolle}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.offeneProtokolle} offen, {stats.abgeschlosseneProtokolle} abgeschlossen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Offene Aufgaben
              </CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.offeneAufgaben}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.ueberfaelligeAufgaben > 0 && (
                  <span className="text-red-600 font-medium">
                    {stats.ueberfaelligeAufgaben} überfällig
                  </span>
                )}
                {stats.ueberfaelligeAufgaben === 0 && 'Alle im Zeitplan'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Mitarbeiter
              </CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalMitarbeiter}</div>
              <p className="text-xs text-slate-500 mt-1">
                Registrierte Benutzer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="protokolle" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="protokolle">Protokolle</TabsTrigger>
            <TabsTrigger value="aufgaben">Aufgaben</TabsTrigger>
            <TabsTrigger value="mitarbeiter">Mitarbeiter</TabsTrigger>
          </TabsList>

          {/* PROTOKOLLE TAB */}
          <TabsContent value="protokolle" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Beschlussprotokolle</CardTitle>
                <CardDescription>
                  Übersicht aller Protokolle sortiert nach Datum
                </CardDescription>
              </CardHeader>
              <CardContent>
                {protokolle.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Noch keine Protokolle vorhanden</p>
                    <p className="text-sm mt-1">Erstellen Sie Ihr erstes Protokoll mit dem Button oben</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {protokolle
                      .sort((a, b) => {
                        const dateA = a.fields.datum ? parseISO(a.fields.datum).getTime() : 0;
                        const dateB = b.fields.datum ? parseISO(b.fields.datum).getTime() : 0;
                        return dateB - dateA; // Neueste zuerst
                      })
                      .map((protokoll) => (
                        <div
                          key={protokoll.record_id}
                          className="flex items-start justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">
                                {protokoll.fields.zweck2 || 'Ohne Titel'}
                              </h3>
                              <Badge variant={getStatusBadgeVariant(protokoll.fields.status)}>
                                {getStatusLabel(protokoll.fields.status)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(protokoll.fields.datum)}</span>
                              </div>

                              {protokoll.fields.ort && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Ort:</span>
                                  <span>{protokoll.fields.ort}</span>
                                </div>
                              )}
                            </div>

                            {protokoll.fields.text_1 && (
                              <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                {protokoll.fields.text_1}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUFGABEN TAB */}
          <TabsContent value="aufgaben" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Überfällige Aufgaben */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Überfällige Aufgaben
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aufgaben.filter(a => {
                    if (a.fields.erledigt || !a.fields.faellig) return false;
                    try {
                      return isBefore(parseISO(a.fields.faellig), new Date());
                    } catch {
                      return false;
                    }
                  }).length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">Keine überfälligen Aufgaben</p>
                  ) : (
                    <div className="space-y-2">
                      {aufgaben
                        .filter(a => {
                          if (a.fields.erledigt || !a.fields.faellig) return false;
                          try {
                            return isBefore(parseISO(a.fields.faellig), new Date());
                          } catch {
                            return false;
                          }
                        })
                        .map((aufgabe) => (
                          <div key={aufgabe.record_id} className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="font-medium text-sm text-slate-900">
                              {aufgabe.fields.beschreibung || 'Ohne Beschreibung'}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Fällig: {formatDate(aufgabe.fields.faellig)}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Offene Aufgaben */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Offene Aufgaben
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aufgaben.filter(a => !a.fields.erledigt).length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Alle Aufgaben erledigt!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {aufgaben
                        .filter(a => !a.fields.erledigt)
                        .slice(0, 5)
                        .map((aufgabe) => {
                          const isUeberfaellig = aufgabe.fields.faellig && isBefore(parseISO(aufgabe.fields.faellig), new Date());
                          return (
                            <div key={aufgabe.record_id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                              <p className="font-medium text-sm text-slate-900">
                                {aufgabe.fields.beschreibung || 'Ohne Beschreibung'}
                              </p>
                              {aufgabe.fields.faellig && (
                                <p className={`text-xs mt-1 ${isUeberfaellig ? 'text-red-600' : 'text-slate-600'}`}>
                                  Fällig: {formatDate(aufgabe.fields.faellig)}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      {aufgaben.filter(a => !a.fields.erledigt).length > 5 && (
                        <p className="text-xs text-slate-500 text-center pt-2">
                          ... und {aufgaben.filter(a => !a.fields.erledigt).length - 5} weitere
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MITARBEITER TAB */}
          <TabsContent value="mitarbeiter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mitarbeiter-Übersicht</CardTitle>
                <CardDescription>
                  Alle registrierten Mitarbeiter mit ihren Funktionen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mitarbeiter.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Noch keine Mitarbeiter registriert</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mitarbeiter.map((person) => (
                      <div
                        key={person.record_id}
                        className="p-4 rounded-lg border border-slate-200 bg-white"
                      >
                        <h3 className="font-semibold text-slate-900">
                          {person.fields.name || 'Ohne Name'}
                        </h3>
                        {person.fields.funktion && (
                          <p className="text-sm text-slate-600 mt-1">{person.fields.funktion}</p>
                        )}
                        {person.fields.bereich && (
                          <Badge variant="secondary" className="mt-2">
                            {person.fields.bereich}
                          </Badge>
                        )}
                        {person.fields.e_mail && (
                          <p className="text-xs text-slate-500 mt-2">{person.fields.e_mail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
