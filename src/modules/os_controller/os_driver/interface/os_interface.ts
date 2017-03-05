import { ApplicationDto } from './../../model/dto/ApplicationDto';

export interface OsInterface{

  onOpens(applications: ApplicationDto[]);

  onChanges(applications: ApplicationDto[], diff:any);

  onCloses(applications: String[]);

  onFocusChange(application: ApplicationDto);

  onSoundChange(sound: number);
}