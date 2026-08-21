import ExcelJS from 'exceljs';
import { prisma } from './db.js';

/**
 * Generates an Excel spreadsheet buffer containing the complete results of a completed game session
 */
export async function generateExport(roomCode: string): Promise<Buffer> {
  const session = await prisma.session.findUnique({
    where: { roomCode: roomCode.toUpperCase() },
    include: { 
      players: true, 
      gameState: true 
    }
  });

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.status !== 'completed' || !session.gameState) {
    throw new Error('Session is not completed or game state is missing');
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Session Results');

  const headers = [
    "Session ID", "Room Code", "Date", "Start Time (UTC)", "End Time (UTC)",
    "Total Players", 
    "Scenario 1 Choice", "Scenario 2 Choice", "Scenario 3 Choice", "Scenario 4 Choice", "Scenario 5 Choice",
    "Mayor Veto (S1)", "Mayor Veto Reason (S1)",
    "Mayor Veto (S2)", "Mayor Veto Reason (S2)",
    "Mayor Veto (S3)", "Mayor Veto Reason (S3)",
    "Mayor Veto (S4)", "Mayor Veto Reason (S4)",
    "Mayor Veto (S5)", "Mayor Veto Reason (S5)",
    "Economic Growth (Final)", "Government Budget (Final)", "People Welfare (Final)",
    "Public Trust (Final)", "Environmental Quality (Final)", "Transparency (Final)",
    "PS (Prosperity Score)", "GQS (Governance Quality Score)", "SS (Sustainability Score)",
    "FPS (Final Prosperity Score)", "City Archetype(s)", "Role Beneficiaries", "Players & Roles"
  ];

  ws.addRow(headers);
  
  // Format Header Row (Bold, white font, dark blue background `#1F4E79`)
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' }
  };
  
  const gs = session.gameState;
  
  // Date and Time formatting
  const dateStr = session.startedAt ? session.startedAt.toISOString().split('T')[0] : '';
  const startTime = session.startedAt ? session.startedAt.toISOString().split('T')[1].substring(0, 8) : '';
  const endTime = session.endedAt ? session.endedAt.toISOString().split('T')[1].substring(0, 8) : '';

  // Players and Roles serialization (e.g. "John Doe:Mayor; Jane:Journalist")
  const playersRolesStr = session.players
    .map(p => `${p.fullName}:${p.role ? p.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'None'}`)
    .join('; ');

  const data = [
    session.id,
    session.roomCode,
    dateStr,
    startTime,
    endTime,
    session.players.length,
    gs.scenario0Choice || 'N/A',
    gs.scenario1Choice || 'N/A',
    gs.scenario2Choice || 'N/A',
    gs.scenario3Choice || 'N/A',
    gs.scenario4Choice || 'N/A',
    gs.scenario0Veto ? 'Yes' : 'No',
    gs.scenario0VetoReason || '',
    gs.scenario1Veto ? 'Yes' : 'No',
    gs.scenario1VetoReason || '',
    gs.scenario2Veto ? 'Yes' : 'No',
    gs.scenario2VetoReason || '',
    gs.scenario3Veto ? 'Yes' : 'No',
    gs.scenario3VetoReason || '',
    gs.scenario4Veto ? 'Yes' : 'No',
    gs.scenario4VetoReason || '',
    gs.economicGrowth,
    gs.governmentBudget,
    gs.peopleWelfare,
    gs.publicTrust,
    gs.environmentalQuality,
    gs.transparency,
    gs.ps !== null ? Number(gs.ps.toFixed(2)) : 0,
    gs.gqs !== null ? Number(gs.gqs.toFixed(2)) : 0,
    gs.ss !== null ? Number(gs.ss.toFixed(2)) : 0,
    gs.fps !== null ? Number(gs.fps.toFixed(2)) : 0,
    gs.archetypes || '',
    gs.beneficiaries || '',
    playersRolesStr
  ];

  ws.addRow(data);

  // Auto-fit columns
  ws.columns.forEach(col => {
    col.width = Math.max(col.header?.length ?? 10, 15);
  });

  const buffer = await wb.xlsx.writeBuffer() as unknown as Buffer;
  return buffer;
}
