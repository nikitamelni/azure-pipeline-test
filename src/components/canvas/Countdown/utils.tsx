import { cn } from '@/utils/styling';
import {
  CountdownUnit,
  HOURS_IN_DAY,
  MILLISECONDS_IN_SECOND,
  MINUTES_IN_HOUR,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from './constants';

type UniformDate = {
  datetime: string;
};

export const formatTime = (targetDate?: UniformDate) => {
  const endDate = new Date(targetDate?.datetime ?? 0).getTime();
  const now = new Date().getTime();
  const timeDifference = Math.max(Math.floor((endDate - now) / MILLISECONDS_IN_SECOND), 0);
  const seconds = Math.floor(timeDifference % SECONDS_IN_MINUTE);
  const minutes = Math.floor((timeDifference / SECONDS_IN_MINUTE) % MINUTES_IN_HOUR);
  const hours = Math.floor((timeDifference / SECONDS_IN_HOUR) % HOURS_IN_DAY);
  const days = Math.floor(timeDifference / SECONDS_IN_DAY);

  return {
    days,
    hours,
    minutes,
    seconds,
    timeDifference,
  };
};

export const renderNumberList = ({
  maxUnitsCount,
  currentTime,
  unit,
  isAlignEnd,
}: {
  maxUnitsCount: number;
  currentTime: number;
  unit: CountdownUnit;
  isAlignEnd?: boolean;
}) => (
  <div className="relative mx-auto h-[1.25em] w-[1.75em] overflow-hidden">
    <div
      className="absolute transition-transform duration-500 ease-in-out"
      style={{ transform: `translateY(-${currentTime * 1.25}em)` }}
    >
      {Array.from(
        // NOTE: Plus one since counting starts from 0
        {
          length: maxUnitsCount + 1,
        },
        (_, unitNumber) => (
          <div
            key={`${unit}-${unitNumber}`}
            className={cn('flex h-[1.25em] w-[1.75em] justify-center', {
              ['items-end']: isAlignEnd,
              ['items-center']: !isAlignEnd,
            })}
          >
            {unitNumber < 10 ? `0${unitNumber}` : unitNumber}
          </div>
        )
      )}
    </div>
  </div>
);
