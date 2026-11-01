'use client';

import React from 'react';
import { WeatherTelemetry, Language, DisasterType } from '@/types/claim';
import { translations } from '@/data/translations';
import { CloudRain, Wind, AlertTriangle, CheckCircle2, Radio, Info } from 'lucide-react';

interface WeatherViewerProps {
  weather: WeatherTelemetry;
  disasterType: DisasterType;
  incidentDate: string;
  lang: Language;
}

export const WeatherViewer: React.FC<WeatherViewerProps> = ({
  weather,
  disasterType,
  incidentDate,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-3.5">
      {/* Top AWS Sensor Meta Card */}
      <div className="bg-[#0f2444] text-white rounded-md p-3.5 border border-[#1b3966] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-white/10 text-blue-200 flex items-center justify-center shrink-0 border border-white/20">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-200 bg-white/10 px-2 py-0.2 rounded border border-white/20">
                {weather.stationId}
              </span>
              <span className="text-[11px] text-slate-300">
                {weather.stationDistanceKm} km {lang === 'te' ? 'దూరంలో' : 'from plot'}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {weather.stationName}
            </h4>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-300">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">{t.incidentDate}</span>
          <span className="font-mono text-amber-200 font-bold text-xs">
            {weather.incidentDate}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards: Rainfall Telemetry, Hail Alert, Wind Speed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Rainfall Card */}
        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">{t.recordedRainfall}</span>
            <CloudRain className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-bold text-slate-900">{weather.recordedRainfallMm}</span>
            <span className="text-[11px] font-medium text-slate-500">mm / 24h</span>
          </div>

          {/* Visual bar */}
          <div className="mt-2.5 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>{t.normalRainfall}: {weather.normalRainfallMm}mm</span>
              <span className="font-bold text-blue-800">+{weather.rainfallDeviationPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded h-1.5 overflow-hidden">
              <div
                className="bg-blue-700 h-1.5 rounded transition-all"
                style={{ width: `${Math.min(100, (weather.recordedRainfallMm / 100) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hail Alert Doppler Status */}
        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">{t.hailReport}</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${weather.hailAlertTriggered ? 'text-amber-700' : 'text-slate-400'}`} />
          </div>
          <div className="mt-1">
            {weather.hailAlertTriggered ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <CheckCircle2 className="w-3 h-3 text-amber-800" />
                {t.hailConfirmed}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                <Info className="w-3 h-3 text-slate-500" />
                {t.hailNone}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {lang === 'te' ? 'ఇండియన్ మెటీరియోలాజికల్ డిపార్ట్‌మెంట్ (IMD) రాడార్ రికార్డు' : 'Corroborated by IMD Doppler Radar logs'}
          </p>
        </div>

        {/* Wind Speed */}
        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">{t.windSpeed}</span>
            <Wind className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-bold text-slate-900">{weather.maxWindSpeedKmph}</span>
            <span className="text-[11px] font-medium text-slate-500">km/h</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {weather.maxWindSpeedKmph > 50 
              ? (lang === 'te' ? 'తీవ్రమైన ఈదురు గాలులు నిర్ధారించబడ్డాయి' : 'Severe gale gusts confirmed')
              : (lang === 'te' ? 'సాధారణ గాలులు మాత్రమే నమోదయ్యాయి' : 'Moderate wind speeds')}
          </p>
        </div>
      </div>

      {/* Empirical Corroboration Verdict */}
      <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-800 flex items-start space-x-2">
        <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-xs text-slate-900">
            {lang === 'te' ? 'వాతావరణ ఆధారాల ఫలితం:' : 'Empirical Corroboration Verdict:'}
          </span>
          <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">
            {lang === 'te'
              ? `దరఖాస్తుదారు పేర్కొన్న విపత్తు తేదీ (${incidentDate}) న సమీప AWS కేంద్రంలో ${weather.recordedRainfallMm} మి.మీ వర్షపాతం నమోదైంది. ఈ ఆధారాలు క్లెయిమ్ చేసిన పంట నష్టానికి సమర్థనగా నిలుస్తాయి.`
              : `On the declared incident date (${incidentDate}), Mandal AWS recorded ${weather.recordedRainfallMm}mm rainfall and max wind gusts of ${weather.maxWindSpeedKmph} km/h, providing empirical validation for this claim under SDRF standards.`}
          </p>
        </div>
      </div>
    </div>
  );
};
