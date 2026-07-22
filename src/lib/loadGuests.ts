import { getGhFile, decodeBase64ToUtf8 } from "./githubFiles";
import { FAMILIAS as LOCAL_FAMILIAS } from "@/data/familias";

// ⬇️ Invitados tipados
export type Family = {
  id: string;
  nombreFamilia: string;
  nroPersonas: number;
  telefono?: string;
  invitados?: { adult?: number; kids?: number; total?: number };
};

const GUESTS_PATH = process.env.GITHUB_GUESTS_PATH || "data/guests.json";

/* Helpers de tipado */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toStringSafe(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}
function toNumberSafe(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export async function loadGuests(): Promise<Family[]> {
  try {
    const gh = await getGhFile(GUESTS_PATH);
    if (!gh) return LOCAL_FAMILIAS as unknown as Family[];

    let raw = decodeBase64ToUtf8(gh.content);
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);

    if (GUESTS_PATH.endsWith(".json")) {
      const cleaned = raw
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/,\s*([\]}])/g, "$1");

      const json: unknown = JSON.parse(cleaned);

      let arrCandidate: unknown = [];
      if (Array.isArray(json)) {
        arrCandidate = json;
      } else if (isRecord(json)) {
        const rec = json as Record<string, unknown>;
        const pick = rec.families ?? rec.FAMILIAS ?? rec.familias;
        if (Array.isArray(pick)) {
          arrCandidate = pick;
        } else {
          const firstArray = Object.values(rec).find(
            (v): v is unknown[] => Array.isArray(v)
          );
          arrCandidate = firstArray ?? [];
        }
      }

      const finalArr: unknown[] = Array.isArray(arrCandidate) ? arrCandidate : [];
      return normalizeFamilies(finalArr);
    }

    if (GUESTS_PATH.endsWith(".ts")) {
      const match = raw.match(
        /export\s+const\s+FAMILIAS[\s\S]*?=\s*(\[[\s\S]*?\]);?/
      );
      if (!match) throw new Error("No se pudo localizar el array FAMILIAS en el .ts");
      const arrayLiteral = match[1];

      const cleaned = arrayLiteral
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/,\s*([\]}])/g, "$1");

      const parsed: unknown = JSON.parse(cleaned);
      const arr: unknown[] = Array.isArray(parsed) ? parsed : [];
      return normalizeFamilies(arr);
    }

    return LOCAL_FAMILIAS as unknown as Family[];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[loadGuests] fallback a LOCAL_FAMILIAS:", e);
    return LOCAL_FAMILIAS as unknown as Family[];
  }
}

function normalizeFamilies(arr: unknown[]): Family[] {
  return arr
    .map((x): Family | null => {
      if (!isRecord(x)) return null;

      const rec = x as Record<string, unknown>;

      const id = toStringSafe(rec.id).trim();
      const nombreFamilia = (
        toStringSafe(rec.nombreFamilia) || toStringSafe(rec.nombre)
      ).trim();
      const telefono = toStringSafe(rec.telefono).trim();

      // Invitados: { invitados: { adult, kids, total } }
      const rawInv = isRecord(rec.invitados)
        ? (rec.invitados as Record<string, unknown>)
        : undefined;
      const invAdult = rawInv ? toNumberSafe(rawInv.adult) : NaN;
      const invKids = rawInv ? toNumberSafe(rawInv.kids) : NaN;
      const invTotal = rawInv ? toNumberSafe(rawInv.total) : NaN;

      let nroPersonas = NaN;
      if (Number.isFinite(invTotal)) {
        nroPersonas = invTotal;
      } else if (Number.isFinite(invAdult) || Number.isFinite(invKids)) {
        const a = Number.isFinite(invAdult) ? invAdult : 0;
        const k = Number.isFinite(invKids) ? invKids : 0;
        if (a + k > 0) nroPersonas = a + k;
      }

      // Fallback a esquema antiguo (nroPersonas | personas | nro)
      if (!Number.isFinite(nroPersonas)) {
        const legacy =
          rec.nroPersonas ?? rec.personas ?? rec.nro;
        nroPersonas = toNumberSafe(legacy);
      }

      const fam: Family = {
        id,
        nombreFamilia,
        nroPersonas,
        ...(telefono ? { telefono } : {}),
        ...(rawInv
          ? {
              invitados: {
                adult: Number.isFinite(invAdult) ? invAdult : undefined,
                kids: Number.isFinite(invKids) ? invKids : undefined,
                total: Number.isFinite(invTotal) ? invTotal : undefined,
              },
            }
          : {}),
      };

      if (!fam.id || !fam.nombreFamilia || !Number.isFinite(fam.nroPersonas)) {
        return null;
      }
      return fam;
    })
    .filter((f): f is Family => f !== null);
}
