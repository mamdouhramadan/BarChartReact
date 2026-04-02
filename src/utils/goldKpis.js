import { GOLD_SERIES_OPTIONS } from '../store/useGoldStore';

const goldKpis = ({ observations = [], seriesId = '' }) => {
  if (!observations.length) {
    return null;
  }

  const seriesMeta = GOLD_SERIES_OPTIONS.find((option) => option.id === seriesId);
  const seriesTitle = seriesMeta ? seriesMeta.label : seriesId;

  const firstPoint = observations[0];
  const latestPoint = observations[observations.length - 1];
  const values = observations.map((row) => row.value);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);
  const changePct = ((latestPoint.value - firstPoint.value) / firstPoint.value) * 100;

  return {
    seriesTitle,
    startPrice: Number(firstPoint.value.toFixed(2)),
    endPrice: Number(latestPoint.value.toFixed(2)),
    minPrice: Number(minPrice.toFixed(2)),
    maxPrice: Number(maxPrice.toFixed(2)),
    changePct: Number(changePct.toFixed(2)),
    observationCount: observations.length,
    latestDate: latestPoint.date
  };
};

export default goldKpis;
