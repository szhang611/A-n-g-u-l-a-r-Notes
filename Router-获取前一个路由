  
  this.router.events
    .filter(e => e instanceof RoutesRecognized)
    .pairwise()
    .subscribe((event: any[]) => {
      console.log(event);
      console.log(event[0].urlAfterRedirects);
    });
    
    // With pairwise, You can see what url is from and to.
    // "RoutesRecognized" is the changing step from origin to target url.
    // so filter it and get previous url from it.
    // Last but not least,
    // this code put parent component or higher (ex, app.component.ts)
    // because this code fire after finish routing.
    
