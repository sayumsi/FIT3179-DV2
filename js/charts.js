// First-section preview only. Chart specification stays separate and readable.
async function renderBirdMap() {
  const target = document.getElementById('chart01');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load. Please check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/01_species_richness_map.vg.json');
    if (!response.ok) throw new Error(`JSON HTTP ${response.status}`);
    const spec = await response.json();
    spec.width = 'container';
    const view = await vegaEmbed(target, spec, {renderer:'svg',actions:false,tooltip:true});
    window.__birdMapView = view;
  } catch (error) {
    console.error('Bird map loading error:', error);
    target.innerHTML = '<p class="chart-error">The map could not load. Try opening this folder using VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded',renderBirdMap);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(async () => {
    if (window.__birdMapView?.view) window.__birdMapView.view.finalize();
    await renderBirdMap();
  }, 350);
});


// Chart 2 only. Keep the Chart 1 renderer above unchanged.

/* CHART 2: VEGA-LITE LOLLIPOP */

async function renderBirdLollipop() {
  const target = document.getElementById("chart02");

  if (!target) return;

  try {
    const response = await fetch(
      "charts/02_occurrence_lollipop.vl.json"
    );

    if (!response.ok) {
      throw new Error("Could not load Chart 2 JSON");
    }

    const spec = await response.json();

    const availableWidth = Math.max(
      260,
      target.clientWidth || 350
    );

    spec.width = Math.min(
      390,
      Math.max(260, availableWidth - 38)
    );

    const result = await vegaEmbed(target, spec, {
      renderer: "svg",
      actions: false,
      tooltip: true
    });

    window.__birdLollipopView = result;

  } catch (error) {
    console.error("Chart 2 loading error:", error);

    target.innerHTML =
      '<p class="chart-error">Chart 2 could not load.</p>';
  }
}

window.addEventListener(
  "DOMContentLoaded",
  renderBirdLollipop
);

/* Re-render Chart 2 on screen resize */

let lollipopResizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(lollipopResizeTimer);

  lollipopResizeTimer = setTimeout(async () => {
    if (window.__birdLollipopView?.view) {
      window.__birdLollipopView.view.finalize();
    }

    await renderBirdLollipop();
  }, 350);
});



// Chart 3: choose one of the six genuinely observed bird species (April 2025).
async function renderStateLeadersHeatmap() {
  const target = document.getElementById('chart03');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/03_state_leaders_heatmap.vl.json');
    if (!response.ok) throw new Error(`JSON HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 320;
    spec.width = Math.max(100, Math.min(300, Math.floor(available - 112)));
    spec.height = available < 270 ? 310 : 300;
    if (available < 315) {
      spec.encoding.x.axis.labelFontSize = 10;
      spec.encoding.y.axis.labelFontSize = 10;
      spec.encoding.y.axis.labelLimit = 106;
    }
    if (window.__birdHeatmapView?.view) window.__birdHeatmapView.view.finalize();
    window.__birdHeatmapView = await vegaEmbed(target, spec, {
      renderer: 'svg', actions: false, tooltip: true
    });
  } catch (error) {
    console.error('Species heatmap loading error:', error);
    target.innerHTML = '<p class="chart-error">The heatmap could not load. Try opening this folder using VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', () => {
  renderStateLeadersHeatmap();
});
let heatmapResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(heatmapResizeTimer);
  heatmapResizeTimer = setTimeout(renderStateLeadersHeatmap, 350);
});


// Chart 4: Monthly count of all regularly recorded species from Birdfact's selected Australian list.
async function renderSeasonalVisitors() {
  const target = document.getElementById('chart04');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/04_all_regular_species_line.vl.json');
    if (!response.ok) throw new Error(`Monthly species JSON HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 445;
    spec.width = Math.max(205, Math.min(408, Math.floor(available - 75)));
    spec.height = available < 340 ? 235 : 250;
    if (available < 350) {
      spec.encoding.x.axis.labelFontSize = 9;
      spec.encoding.y.axis.titleFontSize = 10;
      spec.encoding.y.axis.labelFontSize = 10;
    }
    if (window.__seasonalVisitorsView?.view) window.__seasonalVisitorsView.view.finalize();
    window.__seasonalVisitorsView = await vegaEmbed(target, spec, {
      renderer:'svg', actions:false, tooltip:true
    });
  } catch (error) {
    console.error('Monthly species line chart error:', error);
    target.innerHTML = '<p class="chart-error">Unable to load the monthly species chart. Try VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded',renderSeasonalVisitors);
let seasonalResizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(seasonalResizeTimer);
  seasonalResizeTimer=setTimeout(renderSeasonalVisitors,350);
});


// Chart 5: November–June difference in regularly recorded species (Birdfact).
async function renderSeasonalDifferenceMap() {
  const target = document.getElementById('chart05');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/05_seasonal_difference_symbol_map.vl.json');
    if (!response.ok) throw new Error(`Map JSON HTTP ${response.status}`);
    const spec = await response.json();
    // The CSV has real June, November and difference values for all eight regions.
    // Unlike the former heatmap highlight, switching the dropdown changes the
    // quantitative value represented by EVERY symbol and its label.
    const chosen = document.getElementById('seasonal-map-view')?.value || 'difference';
    const mode = ['difference', 'june', 'november'].includes(chosen) ? chosen : 'difference';
    const modes = {
      difference: {
        field:'difference', max:17, area:1550,
        explanation:'<strong>That seasonal rise was not equal everywhere.</strong> NSW had <strong>17 more</strong> regularly recorded species in November than June, but ACT had only <strong>four more</strong>.'
      },
      june: {
        field:'june', max:80, area:1700,
        explanation:'<strong>Winter looked different across states.</strong> Queensland had <strong>61</strong> regularly recorded species in June, compared with <strong>58</strong> in NSW and <strong>28</strong> in the ACT.'
      },
      november: {
        field:'november', max:80, area:1700,
        explanation:'<strong>Spring brought higher totals.</strong> NSW reached <strong>75</strong> regularly recorded species in November, followed by Queensland at <strong>73</strong> and Victoria at <strong>72</strong>.'
      }
    };
    const current = modes[mode];
    spec.layer[2].encoding.size.field = current.field;
    spec.layer[2].encoding.size.scale = {
      type:'linear', domain:[0,current.max], range:[0,current.area], zero:true
    };
    // Values printed inside all state circles (ACT uses its external leader label).
    const labelExpr = mode === 'difference' ? "'+' + datum.difference" : "'' + datum." + current.field;
    spec.layer[4].transform[1].calculate = labelExpr;
    spec.layer[5].transform[1].calculate = labelExpr;
    const insight = document.getElementById('seasonal-map-insight');
    if (insight) insight.innerHTML = current.explanation;
    target.setAttribute('aria-label', `Proportional symbol map comparing ${mode === 'difference' ? 'the increase in regularly recorded species from June to November' : 'regularly recorded species in ' + mode} across the eight Australian states and territories. Hover for both month values.`);
    const available = target.getBoundingClientRect().width || target.clientWidth || 425;
    spec.width = Math.max(260, Math.min(430, Math.floor(available - 30)));
    spec.height = available < 340 ? 245 : 260;
    if (window.__seasonalDifferenceMapView?.view) window.__seasonalDifferenceMapView.view.finalize();
    window.__seasonalDifferenceMapView = await vegaEmbed(target, spec, {
      renderer:'svg', actions:false, tooltip:true
    });
  } catch (error) {
    console.error('Seasonal difference map error:', error);
    target.innerHTML = '<p class="chart-error">Unable to load Chart 5. Try VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('seasonal-map-view')?.addEventListener('change', renderSeasonalDifferenceMap);
  renderSeasonalDifferenceMap();
});
let differenceMapResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(differenceMapResizeTimer);
  differenceMapResizeTimer = setTimeout(renderSeasonalDifferenceMap, 350);
});


// Chart 6: Grouped primary habitats of matched Australian bird species.
// The labels and exact percentages are sourced from data/06_habitat_summary.csv.
async function renderBirdHabitatBars() {
  const target = document.getElementById('chart06');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load.</p>';
    return;
  }
  try {
    const response = await fetch('charts/06_bird_habitat_horizontal_bar.vl.json');
    if (!response.ok) throw new Error(`Chart 6 JSON HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 375;
    spec.width = Math.max(135, Math.floor(available - 38));
    spec.height = {step:46};
    if (available < 310) spec.layer[1].mark.fontSize = 10;
    if (window.__birdHabitatBarsView?.view) window.__birdHabitatBarsView.view.finalize();
    window.__birdHabitatBarsView = await vegaEmbed(target, spec, {
      renderer:'svg', actions:false, tooltip:true
    });
  } catch (error) {
    console.error('Habitat bar chart failed', error);
    target.innerHTML = '<p class="chart-error">Chart 6 could not load. Open this website using VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', renderBirdHabitatBars);
let birdHabitatResize;
window.addEventListener('resize', () => {
  clearTimeout(birdHabitatResize);
  birdHabitatResize = setTimeout(renderBirdHabitatBars, 350);
});


// Chart 7: aligned butterfly chart of species found only in Australia vs elsewhere.
async function renderAustralianBirdUniqueness() {
  const target = document.getElementById('chart07');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load.</p>';
    return;
  }
  try {
    const response = await fetch('charts/07_bird_group_uniqueness_butterfly.vl.json');
    if (!response.ok) throw new Error(`Chart 7: HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 420;
    // The bird names are now an HTML column beside the chart, not Vega axis labels.
    // That leaves more room for the two mirrored bar groups.
    // Eight compact rows must match the CSS grid of bird names exactly.
    // Keep margins and the 0% baseline aligned to the separate HTML axis.
    spec.width = Math.max(135, Math.floor(available - 14));
    spec.height.step = 32;
    if (available < 250) {
      spec.layer[0].encoding.x.axis.values = [-100, 0, 100];
      spec.layer[0].encoding.x.axis.labelFontSize = 10;
    }
    if (window.__birdUniquenessView?.view) window.__birdUniquenessView.view.finalize();
    window.__birdUniquenessView = await vegaEmbed(target, spec, {
      renderer:'svg', actions:false, tooltip:true
    });
  } catch (error) {
    console.error('Bird uniqueness butterfly chart failed', error);
    target.innerHTML = '<p class="chart-error">Unable to load Chart 7. Use VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', renderAustralianBirdUniqueness);
let uniquenessResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(uniquenessResizeTimer);
  uniquenessResizeTimer = setTimeout(renderAustralianBirdUniqueness, 330);
});


// Chart 8: connected dot comparison of Australia-only and elsewhere-occurring species' primary habitats.
async function renderHabitatConnectedDots() {
  const target = document.getElementById('chart08');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">Chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/08_habitat_connected_dots.vl.json');
    if (!response.ok) throw new Error(`Chart 8 specification HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 520;
    const mobile = available < 440;
    const leftWidth = mobile ? 96 : 120;
    const plotWidth = Math.max(190, Math.min(430, Math.floor(available - leftWidth - 18)));
    spec.hconcat[0].width = leftWidth;
    spec.hconcat[1].width = plotWidth;
    spec.hconcat[0].height = { step: mobile ? 46 : 50 };
    spec.hconcat[1].height = { step: mobile ? 46 : 50 };
    if (mobile) {
      spec.hconcat[0].layer[0].mark.fontSize = 11;
      spec.hconcat[1].layer[3].mark.fontSize = 10;
      spec.hconcat[1].layer[4].mark.fontSize = 10;
      spec.hconcat[1].layer[0].encoding.x.axis.titleFontSize = 11;
      spec.hconcat[1].layer[0].encoding.x.axis.labelFontSize = 10;
    }
    if (window.__habitatConnectedDotsView?.view) window.__habitatConnectedDotsView.view.finalize();
    window.__habitatConnectedDotsView = await vegaEmbed(target, spec, {
      renderer: 'svg', actions: false, tooltip: true
    });
  } catch (error) {
    console.error('Habitat connected dot chart failed', error);
    target.innerHTML = '<p class="chart-error">Unable to load Chart 8. Please use VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded',renderHabitatConnectedDots);
let habitatConnectedDotsResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(habitatConnectedDotsResizeTimer);
  habitatConnectedDotsResizeTimer = setTimeout(renderHabitatConnectedDots, 350);
});


// Chart 9: 2010 vs 2020 Australian threatened bird taxa (The Whistler, 2023, Table 1).
async function renderThreatenedBirdSlope() {
  const target = document.getElementById('chart09');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">The chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/09_threatened_bird_slope.vl.json');
    if (!response.ok) throw new Error(`Chart 9 JSON HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 460;
    // Reserve room for the vertical axis and numerical labels at line ends.
    spec.width = Math.max(180, Math.min(410, Math.floor(available - 65)));
    spec.height = available < 350 ? 242 : 263;
    if (available < 350) {
      spec.encoding.x.axis.labelFontSize = 11;
      spec.encoding.y.axis.titleFontSize = 11;
      for (const layer of spec.layer.slice(2)) layer.mark.fontSize = 11;
    }
    if (window.__threatenedBirdSlopeView?.view) window.__threatenedBirdSlopeView.view.finalize();
    window.__threatenedBirdSlopeView = await vegaEmbed(target, spec, {
      renderer:'svg', actions:false, tooltip:true
    });
  } catch (error) {
    console.error('Threatened bird slope chart failed:', error);
    target.innerHTML = '<p class="chart-error">Chart 9 could not load. Open this folder using VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', renderThreatenedBirdSlope);
let threatSlopeResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(threatSlopeResizeTimer);
  threatSlopeResizeTimer = setTimeout(renderThreatenedBirdSlope, 350);
});


// Chart 10: state choropleth of 2023 Threatened Bird Index regional declines (2000–2020).
async function renderThreatenedBirdDeclineMap() {
  const target = document.getElementById('chart10');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">Chart library could not load. Please check your connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/10_threatened_bird_decline_choropleth.vl.json?v=20261101-maplegend');
    if (!response.ok) throw new Error(`Chart 10 HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || target.clientWidth || 350;
    // Match the first choropleth: a compact 285px map beside a vertical legend.
    spec.width = Math.max(190, Math.floor(available - 8));
    spec.height = available < 280 ? 242 : 285;
    if (available < 310) {
      // Smaller labels only for narrow mobile cards.
      for (const layer of spec.layer) {
        if (layer.mark?.type === 'text') layer.mark.fontSize = 11;
      }
    }
    if (window.__threatenedDeclineMapView?.view) window.__threatenedDeclineMapView.view.finalize();
    window.__threatenedDeclineMapView = await vegaEmbed(target, spec, {
      renderer: 'svg', actions: false, tooltip: true
    });
  } catch (error) {
    console.error('Threatened bird regional decline map failed:', error);
    target.innerHTML = '<p class="chart-error">Map could not load. Try opening the site with VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', renderThreatenedBirdDeclineMap);
let threatenedMapResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(threatenedMapResizeTimer);
  threatenedMapResizeTimer = setTimeout(renderThreatenedBirdDeclineMap, 350);
});


// Chart 12: two-category risk-improvement waffle (1990–2020).
// Vega-Lite chart spec and 100 tile values remain in editable repository files.
async function renderRiskImprovementWaffle() {
  const target = document.getElementById('chart12');
  if (!target) return;
  if (typeof vegaEmbed !== 'function') {
    target.innerHTML = '<p class="chart-error">Chart library could not load. Check your internet connection.</p>';
    return;
  }
  try {
    const response = await fetch('charts/12_bird_risk_improvement_waffle.vl.json');
    if (!response.ok) throw new Error(`Chart 12 HTTP ${response.status}`);
    const spec = await response.json();
    const available = target.getBoundingClientRect().width || 320;
    const dimension = Math.min(288, Math.max(210, Math.floor(available - 12)));
    spec.width = dimension;
    spec.height = dimension;
    if (window.__birdRiskWaffleView?.view) window.__birdRiskWaffleView.view.finalize();
    window.__birdRiskWaffleView = await vegaEmbed(target, spec, {
      renderer: 'svg', actions: false, tooltip: true
    });
  } catch (error) {
    console.error('Bird extinction-risk waffle chart failed:', error);
    target.innerHTML = '<p class="chart-error">Chart 12 could not load. Open this folder with VS Code Live Server.</p>';
  }
}
window.addEventListener('DOMContentLoaded', renderRiskImprovementWaffle);
let birdWaffleResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(birdWaffleResizeTimer);
  birdWaffleResizeTimer = setTimeout(renderRiskImprovementWaffle, 350);
});


// Chart 11: NSW study with actual, non-jittered reported coordinates.
async function renderNSWThreatenedBirdDotMap() {
 const target=document.getElementById('chart11'); if(!target) return;
 if(typeof vegaEmbed!=='function') {target.textContent='Chart library not available.';return;}
 try{
  const response=await fetch('charts/11_nsw_threatened_bird_dots.vl.json');
  if(!response.ok)throw new Error('chart spec HTTP '+response.status);
  const spec=await response.json();
  const available=target.getBoundingClientRect().width||390;
  // Keep the entire projected NSW outline comfortably inside its card.
  spec.width=Math.max(225,Math.min(370,Math.floor(available-28)));
  spec.height=Math.round(spec.width*0.91);
  if(window.__nswBirdMap?.view) window.__nswBirdMap.view.finalize();
  window.__nswBirdMap=await vegaEmbed(target,spec,{renderer:'svg',actions:false,tooltip:true});
 }catch(err){console.error('NSW bird map error',err);target.innerHTML='<p class="chart-error">Map could not load. Use VS Code Live Server.</p>';}
}
window.addEventListener('DOMContentLoaded',renderNSWThreatenedBirdDotMap);
let nswMapTimer;
window.addEventListener('resize',()=>{clearTimeout(nswMapTimer);nswMapTimer=setTimeout(renderNSWThreatenedBirdDotMap,450);});
