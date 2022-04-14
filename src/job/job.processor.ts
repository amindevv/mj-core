import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ComplexResponse, Currencies, Intervals } from 'src/@types';
import { EventsGateway } from 'src/gateway/events.gateway';
import { SeriesService } from 'src/series/series.service';
import { DateTime } from 'luxon';

import {default as complexSignal} from '../../config/complexSignal.json'
import { ComplexProps } from "src/@types";

// import { ComplexResponse } from 'src/util/types/network';

@Processor('complex')
export class JobProcessor {

  constructor(private readonly signal: EventsGateway, private readonly series: SeriesService) { }

  @Process('complex')
  async handleTranscode(job: Job) {
    console.log("job started");
    // console.log("signal", complexSignal);
    const start_date = DateTime.now().startOf('hour').toFormat('yyyy-LL-dd HH:mm')
    const end_date = DateTime.now().toFormat('yyyy-LL-dd HH:mm')

    const currencies: Currencies[] = []
    complexSignal.pairs.forEach(element => {
      currencies.push(element as Currencies)
    });
    const intervals: Intervals[] = [];
    complexSignal.intervals.forEach(element => {
      intervals.push(element as Intervals);
    });
    const data: ComplexProps = {
      start_date: start_date,
      end_date: end_date,
      symbol: currencies,
      interval: intervals,
      outputsize:12,
      indicators: []
    }
    console.log(data);

    const complexResponse: ComplexResponse = await this.series.postComplex(data);
    console.log(complexResponse);

    this.signal.server.emit("complexSignal", complexResponse)
  }
}