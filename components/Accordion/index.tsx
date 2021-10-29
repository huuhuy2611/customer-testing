import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React, { ReactNode } from "react";

interface IProps {
  title: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
}

function ButtonAccordion(props: IProps): JSX.Element {
  const { title, children, defaultExpanded = false } = props;

  return (
    <div className="custom-accordion">
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <span>{title}</span>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
      <style jsx>
        {`
          .custom-accordion {
            border-bottom: 1px solid #d6d6d6;
            padding: 17px 0;
            :global(.accordion-content) {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ButtonAccordion;
