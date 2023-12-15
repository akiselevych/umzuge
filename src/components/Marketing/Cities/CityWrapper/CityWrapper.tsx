//libs
import React from "react";
import { useDrag, useDrop } from "react-dnd";
// types
import { ICity } from "types/marketing";

interface CityWrapperProps {
  children: React.ReactNode;
  city: ICity;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const CityWrapper: React.FC<CityWrapperProps> = ({
  children,
  city,
  moveItem,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { order: city.order },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ highlighted, hovered }, drop] = useDrop({
    accept: "item",
    drop(item: { order: number }) {
      const dragOrder = item.order;
      const hoverOrder = city.order;

      moveItem(dragOrder, hoverOrder);
    },
    collect: (monitor) => ({
      highlighted: monitor.canDrop(),
      hovered: monitor.isOver(),
    }),
    hover(item: { order: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.order;
      const hoverIndex = city.order;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY =
        clientOffset && clientOffset.y - hoverBoundingRect.top;

      if (hoverClientY) {
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 1.05 : 1,
        filter: hovered ? "blur(1px)" : "blur(0px)",
      }}
    >
      {children}
    </div>
  );
};

export default CityWrapper;
