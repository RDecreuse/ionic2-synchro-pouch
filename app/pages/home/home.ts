import {Component, OnInit} from '@angular/core';
import {Animal} from "services-pouchdb";
import {AnimalService} from "services-pouchdb";

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [AnimalService]
})
export class HomePage implements OnInit {
public animals: Animal[];
public newAnimal: Animal = new Animal();

  constructor(private animalService: AnimalService) {
  }

  ngOnInit(): any {
    this.animalService.initDb().subscribe(() => {
        // shouldn't go there.
        console.error("init db next");
      },
      (e: any) => {
        console.log("init db error :" + e);
      },
      ()=> {
        console.log("init db complete");
        this.startReplication();
      });
  }

private startReplication() {
    this.animalService.replicate(true).subscribe(
      () => {
        console.log('observable next, replication on pause');
        this.displayResultAnimals();
      },
      (err: any) => {
        console.log('Error: ' + err);
      },
      () => {
        console.log('observable Completed, replication done');
        this.displayResultAnimals();
      });
    this.startUpstreamReplication();
  }

private displayResultAnimals(): void {
    this.animals = new Array<Animal>();
  this.animalService.getAnimals().subscribe((animal: Animal) => {
      console.log('observable next, animal=' + animal);
      this.animals.push(animal);
    },
    (err: any) => {
      console.log('Error: ' + err);
    });
}

public add(): void {
    this.animalService.createAnimal(this.newAnimal).subscribe(() => {
      // shouldn't go there.
      console.error("animal add next");
    },
    (e: any) => {
      console.log("animal add error :" + e);
    },
    ()=> {
      console.log("animal add complete");
      this.displayResultAnimals();
      this.newAnimal =  new Animal();
    });
}

private startUpstreamReplication() {
    this.animalService.startUpstreamReplication();
  }
}
