# Clear Lake – Data Visualization: Files Description

**UA06-Temperature**
- It contains lake temperature time series at multiple depths and the lake level (or water column height)
- Column definition:
    - A: Sampling date and time (hourly frequency)
    - B: Lake temperature at the lake surface (check the lake level in the last column) (degC)
    - C: Lake temperature at the lake height above the bottom indicated in the cell C2 (degC)
    - D: Lake temperature at the lake height above the bottom indicated in the cell D2 (degC)
    - E: Lake temperature at the lake height above the bottom indicated in the cell E2 (degC)
    - F: Lake temperature at the lake height above the bottom indicated in the cell F2 (degC)
    - G: Lake temperature at the lake height above the bottom indicated in the cell G2 (degC)
    - H: Lake temperature at the lake height above the bottom indicated in the cell H2 (degC)
    - I: Lake temperature at the lake height above the bottom indicated in the cell I2 (degC)
    - J: Lake temperature at the lake height above the bottom indicated in the cell J2 (degC)
    - K: Maximum lake height or lake level (m)

**UA06-Oxygen**
- It contains lake dissolved oxygen time series at multiple depths and the lake level (or water column
height)
- Column definition:
    - A: Sampling date and time (hourly frequency)
    - B: Lake dissolved oxygen at the lake surface (check the lake level in the last column) (mg/L)
    - C: Lake dissolved oxygen at the lake height above the bottom indicated in the cell C2 (mg/L)
    - D: Lake dissolved oxygen at the lake height above the bottom indicated in the cell D2 (mg/L)
    - E: Maximum lake height or lake level (m)

**Profile Data**
- It contains profiles of multiple variables at multiple sites (UA06, UA07, UA08, UA01, LA04, OA04). Note
that when sites have an appendix (_SBE19 or _SBE25) it means the type of instrument we used for that
particular profile. That’s indicated when we used both instruments on the same day (i.e. two profiles). By default, we use SBE19

- Column definition:
    - A: Date
    - B: Site
    - C: Vector of depth (m)
    - D: Lake temperature (oC)
    - E: Specific Conductivity (uS/cm)
    - F: Chlorophyll (ug/L)
    - G: Lake turbidity (FTU)
    - H: Dissolved oxygen (mg/L)