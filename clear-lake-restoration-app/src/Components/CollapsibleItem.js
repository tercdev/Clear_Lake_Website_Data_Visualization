import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Component for showing a single collapsible item.
 * @param {String} header is the question for the FAQ
 * @param {*} content is the answer or information when the question is pressed on
 * @returns {JSX.Element}
 */
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
        <AccordionDetails >{props.content}</AccordionDetails>
      </Accordion>
    </div>
  );
}
