CREATE TABLE public.Users (
	idUser varchar(20) NOT NULL primary key,
	fullName varchar(100) NOT NULL,
	email varchar NOT NULL,
	cellphone varchar(10) NOT NULL,
	password_ varchar(50) NOT NULL,
	entity varchar(50) NOT NULL,
	rol varchar(50) NOT NULL
);

CREATE TABLE public.Providers (
    idProvider serial NOT NULL primary key,
    idUser varchar(20) ,
	companyName varchar(100) NOT NULL,
	typeProvider varchar NOT NULL,
	serviceDescription varchar(400) NULL,
	averagePunctuation float,
	FOREIGN key (idUser) REFERENCES Users(idUser) on update cascade on delete cascade
);


CREATE TABLE public.Client (
	idClient serial  NOT null primary key,
	 idUser varchar(20) ,
	foreign key (idUser) references Users(idUser) on update cascade on delete cascade 
);

CREATE TABLE public.Services (
	idService serial  NOT null primary key,
	idProvider int, 
	description varchar(800) not null,
	initDate  timestamp not null,
	finDate timestamp not null,
	state varchar not null,
	total int not null,
	foreign key (idProvider) references Providers(idProvider) on update cascade on delete cascade
);

CREATE TABLE public.Contracts (
    idContract serial NOT null primary key,
    idClient int,
    idProvider int,
    idService int,
	totalNeto int, 
	documentContract text ,
    isAceptedProvider boolean,
    isAceptedClient boolean,
    isProviderNotified boolean,
    isClientNotified boolean,
    state text,
     foreign key (idClient) references Clients(idClient) on update cascade on delete cascade,
    foreign key (idProvider) references Providers(idProvider) on update cascade on delete cascade,
	foreign key (idService) references Services(idService) on update cascade on delete cascade
);


CREATE TABLE public.Reviews (
	idReview serial  NOT null primary key,
	idClient int,
	idService int,
    commentary varchar not null, 
	punctuation float not null,
	reviewDate timestamp,
	multimedia text,
	foreign key (idClient) references Clients(idClient) on update cascade on delete cascade, 
    foreign key (idService) references Services(idService) on update cascade on delete cascade
);
