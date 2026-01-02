import {
  EBatterySpecType,
  EFastenerSpecType,
  EInvertorSpecType,
  EMaterialType,
  EPanelSpecType,
} from "@/src/features/goods";

export interface TPanelSpecs {
  type: EPanelSpecType;
  power: number;
}
export interface TInvertorSpecs {
  type: EInvertorSpecType;
  power: number;
  phase: number;
}
export interface TBatterySpecs {
  type: EBatterySpecType;
  capacity: number;
  voltage: number;
}
export interface TFastenerSpecs {
  type: EFastenerSpecType;
  material: EMaterialType;
}

export interface TChargeStationSpecs {
  power: number;
}

export interface TReadyMadeSolutionSpecs {
  power: number;
}
