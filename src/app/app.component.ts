import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {JsonPipe} from '@angular/common';
import {rxResource, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);
  getBlockUrl = `https://eos.hyperion.eosrio.io/v1/chain/get_block`;
  blockNumber = signal<string>('');
  blockNumber$ = toObservable(this.blockNumber).pipe(debounceTime(300));
  debouncedBlockNumber = toSignal(this.blockNumber$);
  blockData = rxResource({
    request: () => parseInt(this.debouncedBlockNumber() || '1'),
    loader: ({request: blockNum}) => {
      return this.http.post(this.getBlockUrl, {block_num_or_id: blockNum}) as Observable<any>;
    }
  });
  errorString = computed<string>(() => {
    return (this.blockData.error() as any).error.message;
  });
}
