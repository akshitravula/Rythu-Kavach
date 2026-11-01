'use client';

import React from 'react';
import { CadastralInfo, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { MapPin, Compass, AlertOctagon, CheckCircle2, Crosshair } from 'lucide-react';

interface CadastralViewerProps {
  cadastral: CadastralInfo;
  damagePhotoUrl: string;
  lang: Language;
}

export const CadastralViewer: React.FC<CadastralViewerProps> = ({
  cadastral,
  damagePhotoUrl,
  lang
}) => {
  const t = translations[lang];
  const { geotagPhotoCoords } = cadastral;
  const isOutOfPlot = geotagPhotoCoords.distanceFromPlotMeters > 100;

  return (
    <div className="space-y-3.5">
      {/* Top Banner Notice */}
      <div className={`p-3 rounded-md border flex items-center justify-between text-xs ${
        isOutOfPlot 
          ? 'bg-rose-50 border-rose-300 text-rose-900' 
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="flex items-center space-x-2.5">
          {isOutOfPlot ? (
            <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <div>
            <h4 className="font-bold text-xs">
              {isOutOfPlot ? t.outsidePlot : t.withinPlot}
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {t.gpsDistanceNotice}: <strong>{geotagPhotoCoords.distanceFromPlotMeters} meters</strong> 
              {isOutOfPlot ? ' (Permissible GPS threshold: 50m)' : ' (Inside parcel cadastral polygon)'}
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block text-[11px] text-slate-500 font-mono">
          <span>GPS Accuracy: ±{geotagPhotoCoords.accuracyMeters}m</span> | <span>Bearing: {geotagPhotoCoords.bearingDegrees}°</span>
        </div>
      </div>

      {/* Grid: Cadastral Visual Canvas & Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Cadastral Visual Canvas */}
        <div className="bg-[#0f2444] rounded-md p-3.5 text-white border border-[#1b3966] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b3966] text-xs">
            <div className="flex items-center space-x-1.5 text-slate-200 font-mono font-bold text-[11px]">
              <Crosshair className="w-3.5 h-3.5 text-blue-300" />
              <span>TS-GIS CADASTRAL LAYER: SY {cadastral.surveyNumber}</span>
            </div>
            <span className="text-slate-300 text-[11px]">
              {cadastral.village}, {cadastral.mandal}
            </span>
          </div>

          {/* SVG Map Graphic */}
          <div className="my-3 relative bg-[#09172e] rounded p-2 border border-[#1b3966] h-56 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a6a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            <svg className="w-full h-full" viewBox="0 0 320 200">
              {/* Adjacent Survey Parcels */}
              <polygon
                points="20,20 120,30 110,100 10,90"
                fill="#162c4e"
                stroke="#25477d"
                strokeWidth="1"
                opacity="0.5"
              />
              <text x="35" y="60" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                Sy 141
              </text>

              <polygon
                points="210,30 300,40 290,110 200,100"
                fill="#162c4e"
                stroke="#25477d"
                strokeWidth="1"
                opacity="0.5"
              />
              <text x="235" y="70" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                Sy 143
              </text>

              {/* Main Cadastral Parcel Polygon */}
              <polygon
                points="110,40 210,45 200,150 90,140"
                fill="#1e3a8a"
                fillOpacity="0.4"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="125" y="90" fill="#f8fafc" fontSize="11" fontWeight="bold">
                Sy {cadastral.surveyNumber}
              </text>
              <text x="128" y="105" fill="#93c5fd" fontSize="10">
                {cadastral.totalExtentAcres} Acres
              </text>

              {/* Plotted GPS Photo Location */}
              {isOutOfPlot ? (
                <>
                  <line
                    x1="150"
                    y1="95"
                    x2="270"
                    y2="165"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="270" cy="165" r="7" fill="#dc2626" />
                  <circle cx="270" cy="165" r="3" fill="#ffffff" />
                  <text x="220" y="185" fill="#fca5a5" fontSize="10" fontWeight="bold">
                    GPS Fix: 680m Away
                  </text>
                </>
              ) : (
                <>
                  <circle cx="150" cy="95" r="7" fill="#16a34a" />
                  <circle cx="150" cy="95" r="3" fill="#ffffff" />
                  <text x="140" y="125" fill="#86efac" fontSize="10" fontWeight="bold">
                    Inside Plot (12m)
                  </text>
                </>
              )}
            </svg>

            {/* Corner Coordinates Legend */}
            <div className="absolute bottom-1.5 left-1.5 text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
              Lat: {cadastral.landCoordinates.lat.toFixed(4)}°N, Lng: {cadastral.landCoordinates.lng.toFixed(4)}°E
            </div>
          </div>

          {/* Survey Details Footer */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1b3966] text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">{t.dharaniPattadar}</span>
              <span className="font-semibold text-white">{cadastral.dharaniPattadarName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{t.passbookNo}</span>
              <span className="font-mono text-amber-200 font-semibold">{cadastral.pattadarPassbookNo}</span>
            </div>
          </div>
        </div>

        {/* Damage Photo with Metadata Overlay */}
        <div className="bg-white rounded-md p-3.5 border border-slate-200 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              {lang === 'te' ? 'ఫీల్డ్ జియోట్యాగ్ ఫోటో' : 'Geotagged Damage Photo'}
            </span>
            <span className="font-mono text-slate-500 text-[11px]">
              {geotagPhotoCoords.timestamp}
            </span>
          </div>

          {/* Photo Container */}
          <div className="relative my-2.5 rounded overflow-hidden border border-slate-200 bg-slate-100 h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={damagePhotoUrl}
              alt="Crop Damage"
              className="w-full h-full object-cover"
            />
            {/* Stamp */}
            <div className="absolute bottom-0 inset-x-0 bg-black/75 p-2 text-white text-[10px] font-mono leading-tight">
              <div className="flex items-center justify-between">
                <span>LAT: {geotagPhotoCoords.lat.toFixed(5)}°N</span>
                <span>LNG: {geotagPhotoCoords.lng.toFixed(5)}°E</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[9px] mt-0.5">
                <span>ACCURACY: ±{geotagPhotoCoords.accuracyMeters}m</span>
                <span className="flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5 text-amber-300" /> {geotagPhotoCoords.bearingDegrees}°
                </span>
              </div>
            </div>
          </div>

          {/* Photo Audit Details */}
          <div className="text-xs text-slate-600 pt-1">
            <p className="flex items-center justify-between">
              <span>{lang === 'te' ? 'నమోదిత విస్తీర్ణం:' : 'Dharani Extent:'}</span>
              <strong className="text-slate-800">{cadastral.totalExtentAcres} {t.acres}</strong>
            </p>
            <p className="flex items-center justify-between mt-0.5">
              <span>{lang === 'te' ? 'క్లెయిమ్ చేసిన విస్తీర్ణం:' : 'Claimed Extent:'}</span>
              <strong className={`${cadastral.claimedExtentAcres > cadastral.totalExtentAcres ? 'text-rose-700' : 'text-slate-800'}`}>
                {cadastral.claimedExtentAcres} {t.acres}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
