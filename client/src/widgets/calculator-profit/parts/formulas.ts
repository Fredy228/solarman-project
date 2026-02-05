/* === Вартість станціі ===
@param ratePerKwCalc - вартість за кВт
@param currentPower - потужність станціі
@return Вартість встановленій станції (грошові одиниці)
*/
export function calcCostInstalledStation(
  ratePerKwCalc: number,
  currentPower: number,
): number {
  return ratePerKwCalc * currentPower;
}

/* === Середній виробіток СЕС в місяць ===
@param currentPower - потужність станціі (кВт)
@return Середнії виробіток електроенергіг за допомогою СЕС за місяць (кВт)
*/
export function calcMonthlyOutputOfStation(currentPower: number): number {
  return 98.21 * currentPower;
}

/* === Середній виробіток СЕС в рік ===
@param monthlyOutputOfStation - середній виробіток СЕС в місяць (кВт)
@return Середнії виробіток електроенергіг за допомогою СЕС за рік (кВт)
*/
export function calcYearlyOutputOfStation(
  monthlyOutputOfStation: number,
): number {
  return 12 * monthlyOutputOfStation;
}

/* === Вартість електроенергії, яку згенерує станція за період експлуатації ===
@param yearlyOutputOfStation - середній виробіток СЕС в рік (кВт)
@param operatingTimeValue - строк експлуатації (років)
@param tariffValue - тариф (грошові одиниці)
@return Вартість електроенергії, яку згенерує станція на ринку за період експлуатації (грошові одиниці)
*/
export function calcCostElectricityGenerated(
  tariffValue: number,
  operatingTimeValue: number,
  yearlyOutputOfStation: number,
): number {
  return yearlyOutputOfStation * operatingTimeValue * tariffValue;
}

/* === Прибуток за всесь срок експлуатації ===
@param costElectricityGenerated - вартість електроенергії, яку згенерує станція за період експлуатації (грошові одиниці)
@param costInstalledStation - вартість встановленій станції (грошові одиниці)
@return Прибуток від станції за весь срок експлуатації (грошові одиниці)
*/
export function calcProfitEntirePeriodOperation(
  costElectricityGenerated: number,
  costInstalledStation: number,
): number {
  return costElectricityGenerated - costInstalledStation;
}

/* === Рентабельність інвестицій за 1 рік ===
@param profitEntirePeriodOperation - прибуток за всесь срок експлуатації (грошові одиниці)
@param costInstalledStation - вартість встановленої станції (грошові одиниці)
@param operatingTimeValue - строк експлуатації (років)
@return Рентабельність інвестицій (%)
*/
export function calcInvestmentProfitabilityPerYear(
  profitEntirePeriodOperation: number,
  costInstalledStation: number,
  operatingTimeValue: number,
): number {
  const investmentProfitability =
    profitEntirePeriodOperation / costInstalledStation;

  return (investmentProfitability / operatingTimeValue) * 100;
}

/* === Окупність станції ===
@param costInstalledStation - вартість встановленої станції (грошові одиниці)
@param tariffValue - тариф (грошові одиниці)
@param yearlyOutputOfStation - середній виробіток СЕС в рік (кВт)
@return Окупність станції (років)
*/
export function calcPaybackPeriodStation(
  costInstalledStation: number,
  tariffValue: number,
  yearlyOutputOfStation: number,
): number {
  return costInstalledStation / (tariffValue * yearlyOutputOfStation);
}

/* === Середня економія за 1 кВт ===
@param costInstalledStation - вартість встановленої станції (грошові одиниці)
@param operatingTimeValue - строк експлуатації (років)
@param yearlyOutputOfStation - середній виробіток СЕС в рік (кВт)
@param tariffValue - тариф (грошові одиниці)
@return Середня економія за 1 кВт (грошові одиниці)
*/
export function calcAverageSavingsPerKw(
  costInstalledStation: number,
  operatingTimeValue: number,
  yearlyOutputOfStation: number,
  tariffValue: number,
): number {
  const costPerKwStantionGenerated =
    costInstalledStation / (operatingTimeValue * yearlyOutputOfStation);

  return tariffValue - costPerKwStantionGenerated;
}
