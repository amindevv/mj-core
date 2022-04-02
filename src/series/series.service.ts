import { SignalDetectorProps } from '../signal/SignalDetector';
import { RequestBuilder } from '../util/RequestBuilder'
import { formatComplexResponse } from '../util/formatter'

export class SeriesService {

    private readonly builder: RequestBuilder = new RequestBuilder()

    async postComplex(body: SignalDetectorProps) {
        const response = await this.builder.requestComplexFrom(body)
        return formatComplexResponse(response)
    }

    async postSeries(body: string) {
        return await this.builder.requestPairFromQuery(body)
    }
}