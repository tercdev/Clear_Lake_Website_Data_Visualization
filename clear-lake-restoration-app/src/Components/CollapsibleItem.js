import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import "./CollapsibleItem.css"

export default function CollapsibleItem(props) {
  return (
    <div className='collapsible-item' >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <h3 className="data-desc">{props.header}</h3>
        </AccordionSummary>
        <AccordionDetails>
            {props.content}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
